# mobile_app

Manager App

## OpenApi Generator

```bash
docker run --rm -v ${PWD}/../:/local openapitools/openapi-generator-cli generate -i /local/openapi/backend.yml -g dart-dio -o /local/mobile_app/backend_client --additional-properties=pubName=backend_client,packageName=backend_client
cd backend_client
flutter pub run build_runner build --delete-conflicting-outputs
```

## Lizenzen der Pakete überprüfen

```bash
dart pub global activate license_checker
lic_ck check-licenses --config license-check.yml
```

## Getting Started

This project is a starting point for a Flutter application.

A few resources to get you started if this is your first Flutter project:

- [Lab: Write your first Flutter app](https://docs.flutter.dev/get-started/codelab)
- [Cookbook: Useful Flutter samples](https://docs.flutter.dev/cookbook)

For help getting started with Flutter development, view the
[online documentation](https://docs.flutter.dev/), which offers tutorials,
samples, guidance on mobile development, and a full API reference.
