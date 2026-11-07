# Einstufig: Gebaut und ausgeführt wird auf dem SDK-Image.
FROM mcr.microsoft.com/dotnet/sdk:10.0
WORKDIR /src
COPY . .
RUN dotnet publish -c Release -o /app
WORKDIR /app
ENTRYPOINT ["dotnet", "Hallo.dll"]
