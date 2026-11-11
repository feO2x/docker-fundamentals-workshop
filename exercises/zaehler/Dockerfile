# Der Besucherzähler, so wie ihn ein Kollege containerisiert hat.
# Er läuft irgendwie - aber nicht so, wie er soll.
FROM mcr.microsoft.com/dotnet/sdk:10.0
WORKDIR /app
COPY . .
RUN dotnet publish -c Release -o out
ENTRYPOINT ["dotnet", "out/Zaehler.dll"]
