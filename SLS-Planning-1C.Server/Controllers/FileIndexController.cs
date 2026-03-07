using Microsoft.AspNetCore.Mvc;
using SLS_Planning_1C.Server.Features.FileIndexing;
using SLS_Planning_1C.Server.Features.Verification;

namespace SLS_Planning_1C.Server.Controllers;

[ApiController]
[Route("api/file-index")]
public sealed class FileIndexController : ControllerBase
{
    private readonly IFileIndexStore _fileIndexStore;
    private readonly IVerificationSettingsStore _verificationSettingsStore;

    public FileIndexController(
        IFileIndexStore fileIndexStore,
        IVerificationSettingsStore verificationSettingsStore)
    {
        _fileIndexStore = fileIndexStore;
        _verificationSettingsStore = verificationSettingsStore;
    }

    [HttpPost("sync")]
    [HttpPost("sync-full")]
    public ActionResult<FileIndexSyncResponse> Sync([FromBody] FileIndexSyncRequest request)
    {
        try
        {
            var result = _fileIndexStore.UpsertSnapshot(request);
            return Ok(result);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
    }


    [HttpPost("sync-delta")]
    public ActionResult<FileIndexSyncResponse> SyncDelta([FromBody] FileIndexDeltaSyncRequest request)
    {
        try
        {
            var result = _fileIndexStore.ApplyDelta(request);
            return Ok(result);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPost("test")]
    public ActionResult<string> Test([FromBody] FileIndexTestRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.FileName))
        {
            return BadRequest("FileName is required.");
        }

        return Ok("Дякую");
    }

    [HttpGet("drawing-preview")]
    public IActionResult DrawingPreview([FromQuery] string detailName)
    {
        if (string.IsNullOrWhiteSpace(detailName))
        {
            return BadRequest("detailName is required.");
        }

        var linkServer = _verificationSettingsStore.Get().SpecificationSettings.LinkServer;
        var match = _fileIndexStore.FindByDetailName(detailName).FirstOrDefault();

        if (match is null)
        {
            return NotFound("Чертеж не найден.");
        }

        var candidates = GetPathCandidates(match, linkServer).ToList();
        var existingPath = candidates.FirstOrDefault(System.IO.File.Exists);

        if (string.IsNullOrWhiteSpace(existingPath))
        {
            return NotFound("Чертеж не найден.");
        }

        var contentType = ResolveContentType(Path.GetExtension(existingPath));
        Response.Headers.Append("X-Drawing-Path", existingPath);
        Response.Headers.Append("X-Drawing-FileName", Path.GetFileName(existingPath));

        return PhysicalFile(existingPath, contentType, enableRangeProcessing: true);
    }

    private static IEnumerable<string> GetPathCandidates(IndexedFileMatch match, string? linkServer)
    {
        if (Path.IsPathRooted(match.File.RelativePath))
        {
            yield return match.File.RelativePath;
        }

        if (!string.IsNullOrWhiteSpace(match.RootPath))
        {
            yield return Path.Combine(match.RootPath, match.File.RelativePath);
        }

        if (!string.IsNullOrWhiteSpace(linkServer))
        {
            yield return Path.Combine(linkServer, match.File.RelativePath);
        }
    }

    private static string ResolveContentType(string? extension)
    {
        return extension?.ToLowerInvariant() switch
        {
            ".pdf" => "application/pdf",
            ".png" => "image/png",
            ".jpg" or ".jpeg" => "image/jpeg",
            ".bmp" => "image/bmp",
            ".gif" => "image/gif",
            ".webp" => "image/webp",
            ".svg" => "image/svg+xml",
            _ => "application/octet-stream"
        };
    }
}

public sealed class FileIndexTestRequest
{
    public required string FileName { get; init; }
}
