#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.

#Depending on the operating system of the host machines(s) that will build or run the containers, the image specified in the FROM statement may need to be changed.
#For more information, please see https://aka.ms/containercompat

FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base
WORKDIR /app
EXPOSE 80

FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
RUN apt-get -y update
RUN apt-get -y upgrade
RUN apt install -y curl
RUN curl -sL https://deb.nodesource.com/setup_18.x | bash - 
RUN apt-get install -y nodejs build-essential

WORKDIR /src
COPY ["Coords.Angular.UI/Coords.Angular.UI.csproj", "Coords.Angular.UI/"]
RUN dotnet restore "Coords.Angular.UI/Coords.Angular.UI.csproj"
COPY . .
WORKDIR "/src/Coords.Angular.UI"
RUN dotnet build "Coords.Angular.UI.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "Coords.Angular.UI.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Coords.Angular.UI.dll"]