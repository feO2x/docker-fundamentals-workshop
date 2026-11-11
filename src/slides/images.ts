// Offizielle Images, die die Teilnehmer direkt verwenden. Die Ausgaben auf den
// Folien (Versionen, /etc/os-release) stammen aus diesen Tags, Stand siehe AGENTS.md.

export const PYTHON_312 = 'python:3.12'
export const PYTHON_313 = 'python:3.13'
export const DOTNET_SDK = 'mcr.microsoft.com/dotnet/sdk:10.0'

/**
 * Die lokale Registry der Push-Übungen (registry:2 statt Harbor, siehe AGENTS.md).
 * Port 5050 statt 5000: Auf macOS belegt der AirPlay-Empfänger Port 5000.
 */
export const REGISTRY_RUN = 'docker run -d --name registry -p 5050:5000 registry:2'
