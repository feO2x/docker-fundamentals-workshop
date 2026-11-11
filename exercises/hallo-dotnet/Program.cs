using System.Runtime.InteropServices;

Console.WriteLine($"Hallo aus .NET {Environment.Version}!");
Console.WriteLine($"Betriebssystem: {RuntimeInformation.OSDescription}");
Console.WriteLine($"Architektur:    {RuntimeInformation.OSArchitecture}");
