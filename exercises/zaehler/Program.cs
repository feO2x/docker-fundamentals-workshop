// Ein Besucherzähler: Jeder Aufruf von / zählt hoch und merkt sich den Stand in PostgreSQL.
using Npgsql;

var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

var verbindung = app.Configuration.GetConnectionString("Zaehler");
if (verbindung is null)
{
    Console.Error.WriteLine("Die Umgebungsvariable ConnectionStrings__Zaehler fehlt.");
    return 1;
}
// Ohne Kerberos sucht Npgsql nicht nach libgssapi_krb5, die im aspnet-Image fehlt.
var einstellungen = new NpgsqlConnectionStringBuilder(verbindung)
{
    GssEncryptionMode = GssEncryptionMode.Disable,
};
var datenbank = NpgsqlDataSource.Create(einstellungen.ConnectionString);

// Die Tabelle legt die App beim Start an. Ist die Datenbank nicht erreichbar, beendet sie sich.
// Mit einem Exit-Code statt einer unbehandelten Exception: Als PID 1 im Container bleibt
// .NET sonst unter Umständen hängen, statt sich zu beenden.
try
{
    await using var befehl = datenbank.CreateCommand(
        "CREATE TABLE IF NOT EXISTS besuche (id int PRIMARY KEY, anzahl int NOT NULL)");
    await befehl.ExecuteNonQueryAsync();
}
catch (NpgsqlException fehler)
{
    Console.Error.WriteLine($"Keine Verbindung zur Datenbank: {fehler.Message}");
    return 1;
}
app.Logger.LogInformation("Datenbank auf {Host} erreichbar", einstellungen.Host);

app.MapGet("/", async (ILogger<Program> logger) =>
{
    await using var befehl = datenbank.CreateCommand(
        """
        INSERT INTO besuche (id, anzahl) VALUES (1, 1)
        ON CONFLICT (id) DO UPDATE SET anzahl = besuche.anzahl + 1
        RETURNING anzahl
        """);
    var besuche = (int)(await befehl.ExecuteScalarAsync())!;

    logger.LogInformation("Besuch Nr. {Besuche}", besuche);
    return $"Moin! Ihr seid Besucher Nr. {besuche}.\n";
});

app.Run();
return 0;
