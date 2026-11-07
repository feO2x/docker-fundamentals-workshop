// Ein Besucherzähler: Jeder Aufruf von / zählt hoch und merkt sich den Stand in einer Datei.
var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

var verzeichnis = app.Configuration["DATEN_VERZEICHNIS"] ?? "/app/daten";
var datei = Path.Combine(verzeichnis, "besuche.txt");
Directory.CreateDirectory(verzeichnis);
var sperre = new Lock();

app.MapGet("/", (ILogger<Program> logger) =>
{
    int besuche;
    lock (sperre)
    {
        besuche = File.Exists(datei) ? int.Parse(File.ReadAllText(datei)) + 1 : 1;
        File.WriteAllText(datei, besuche.ToString());
    }

    logger.LogInformation("Besuch Nr. {Besuche}", besuche);
    return $"Moin! Ihr seid Besucher Nr. {besuche}.\n";
});

app.Run();
