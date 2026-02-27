namespace SLS_Planning_1C.Server.Features.Naming;

public interface INamingCredentialsStore
{
    void Save(string username, string password);
    bool TryGet(out NamingRuntimeCredentials credentials);
}

public sealed class NamingRuntimeCredentialsStore : INamingCredentialsStore
{
    private readonly object _sync = new();
    private NamingRuntimeCredentials? _credentials;

    public void Save(string username, string password)
    {
        var nextCredentials = new NamingRuntimeCredentials
        {
            Username = username,
            Password = password
        };

        lock (_sync)
        {
            _credentials = nextCredentials;
        }
    }

    public bool TryGet(out NamingRuntimeCredentials credentials)
    {
        lock (_sync)
        {
            if (_credentials is null)
            {
                credentials = new NamingRuntimeCredentials();
                return false;
            }

            credentials = _credentials;
            return true;
        }
    }
}

public sealed class NamingRuntimeCredentials
{
    public string Username { get; init; } = string.Empty;
    public string Password { get; init; } = string.Empty;
}
