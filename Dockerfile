FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build

RUN apt-get update && apt-get install -y nodejs npm

WORKDIR /src
COPY . .

RUN dotnet restore SLS-Planning-1C.Server/SLS-Planning-1C.Server.csproj
RUN dotnet publish SLS-Planning-1C.Server/SLS-Planning-1C.Server.csproj \
    -c Release \
    -o /app/publish \
    /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .

EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080

ENTRYPOINT ["dotnet", "SLS-Planning-1C.Server.dll"]