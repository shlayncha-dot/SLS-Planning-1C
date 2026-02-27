using System.Text;
using System.Text.Json;
using Microsoft.Extensions.Options;

namespace SLS_Planning_1C.Server.Features.Naming;

public interface INamingService
{
    Task<NamingCheckResponse> CheckAsync(NamingCheckRequest request, CancellationToken cancellationToken);
}

public sealed class NamingService : INamingService
{

    private readonly HttpClient _httpClient;
    private readonly NamingApiOptions _options;

    public NamingService(HttpClient httpClient, IOptions<NamingApiOptions> options)
    {
        _httpClient = httpClient;
        _options = options.Value;
    }

    public async Task<NamingCheckResponse> CheckAsync(NamingCheckRequest request, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(_options.CheckUrl))
        {
            throw new InvalidOperationException("Не настроен URL API для проверки нейминга.");
        }

        var payload = request.Items.Select(item => new { name = item.Name }).ToList();
        var content = new StringContent(JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json");

        using var response = await _httpClient.PostAsync(_options.CheckUrl, content, cancellationToken);
        if (!response.IsSuccessStatusCode)
        {
            throw new InvalidOperationException($"Сервис Нейминг вернул ошибку {(int)response.StatusCode}.");
        }

        await using var stream = await response.Content.ReadAsStreamAsync(cancellationToken);
        using var document = await JsonDocument.ParseAsync(stream, cancellationToken: cancellationToken);

        var statuses = ExtractStatuses(document.RootElement, request.Items.Count);
        var results = request.Items
            .Select((item, index) =>
            {
                var status = statuses.ElementAtOrDefault(index) ?? "Not found";
                var isFound = string.Equals(status, "Found", StringComparison.OrdinalIgnoreCase);

                return new NamingCheckResultItem
                {
                    RowId = item.RowId,
                    Name = item.Name,
                    Status = status,
                    IsFound = isFound
                };
            })
            .ToList();

        return new NamingCheckResponse
        {
            Results = results
        };
    }

    private static List<string> ExtractStatuses(JsonElement root, int expectedCount)
    {
        if (root.ValueKind != JsonValueKind.Array)
        {
            return Enumerable.Repeat("Not found", expectedCount).ToList();
        }

        var statuses = new List<string>();

        foreach (var item in root.EnumerateArray())
        {
            statuses.Add(ResolveStatus(item));
        }

        return statuses;
    }

    private static string ResolveStatus(JsonElement item)
    {
        if (item.ValueKind == JsonValueKind.String)
        {
            return item.GetString() ?? "Not found";
        }

        if (item.ValueKind != JsonValueKind.Object)
        {
            return "Not found";
        }

        var statusPropertyNames = new[] { "status", "result", "message" };

        foreach (var propertyName in statusPropertyNames)
        {
            if (item.TryGetProperty(propertyName, out var statusElement) && statusElement.ValueKind == JsonValueKind.String)
            {
                return statusElement.GetString() ?? "Not found";
            }
        }

        return "Not found";
    }
}
