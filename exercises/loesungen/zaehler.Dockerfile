FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src
COPY Zaehler.csproj .
RUN dotnet restore
COPY . .
RUN dotnet publish -c Release -o /app --no-restore

FROM mcr.microsoft.com/dotnet/aspnet:10.0
WORKDIR /app
RUN mkdir daten && chown $APP_UID daten
COPY --from=build /app .
USER $APP_UID
ENTRYPOINT ["dotnet", "Zaehler.dll"]
