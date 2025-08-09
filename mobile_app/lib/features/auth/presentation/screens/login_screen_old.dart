import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'dart:io' show Platform;
import 'package:http/http.dart' as http;
import 'package:flutter_appauth/flutter_appauth.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<StatefulWidget> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _appAuth = const FlutterAppAuth();
  bool _isBusy = false;
  final _controller = TextEditingController();
  final String _clientId = 'mobile-app';
  final String _redirectUrl = 'de.cordol.app:/oauthredirect';
  final String _discoveryUrl =
      'https://localhost:20443/realms/openfiresource/.well-known/openid-configuration';

  final AuthorizationServiceConfiguration
  _serviceConfiguration = const AuthorizationServiceConfiguration(
    authorizationEndpoint: 'https://demo.duendesoftware.com/connect/authorize',
    tokenEndpoint: 'https://demo.duendesoftware.com/connect/token',
    endSessionEndpoint: 'https://demo.duendesoftware.com/connect/endsession',
  );

  final List<String> _scopes = <String>[
    'openid',
    'profile',
    'email',
    'offline_access',
  ];

  String? _codeVerifier;
  String? _nonce;
  String? _authorizationCode;
  String? _refreshToken;
  String? _accessToken;
  String? _idToken;
  String? _error;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Login')),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: ListView(
          children: [
            TextField(
              controller: _controller,
              decoration: InputDecoration(labelText: 'Server-URL eingeben'),
            ),
            SizedBox(height: 20),
            Center(
              child: ElevatedButton(
                onPressed: () => _login(),
                child: Text('An Organisation anmelden'),
              ),
            ),
            SizedBox(height: 20),
            Text(
              'Access-Token: ${_accessToken?.substring(0, _accessToken!.length > 30 ? 30 : _accessToken?.length) ?? 'kein Access-Token'}',
            ),
            SizedBox(height: 20),
            Text(
              'Refresh-Token: ${_refreshToken?.substring(0, _refreshToken!.length > 30 ? 30 : _refreshToken?.length) ?? 'kein Refresh-Token'}',
            ),
            SizedBox(height: 20),
            Text(
              'Id-Token: ${_idToken?.substring(0, _idToken!.length > 30 ? 30 : _idToken?.length) ?? 'kein Id-Token'}',
            ),
            SizedBox(height: 20),
            Text(
              'Error: ${_error?.substring(0, _error!.length > 30 ? 30 : _error?.length) ?? 'kein Fehler'}',
            ),
          ],
        ),
      ),
    );
  }

  void _login({
    ExternalUserAgent externalUserAgent =
        ExternalUserAgent.asWebAuthenticationSession,
  }) async {
    try {
      print(1);
      _setBusyState();
      print(2);

      /*
        This shows that we can also explicitly specify the endpoints rather than
        getting from the details from the discovery document.
      */
      final AuthorizationTokenResponse result = await _appAuth
          .authorizeAndExchangeCode(
            AuthorizationTokenRequest(
              discoveryUrl: _discoveryUrl,
              _clientId,
              _redirectUrl,
              scopes: _scopes,
              externalUserAgent: externalUserAgent,
            ),
          );
      print(3);

      /*
        This code block demonstrates passing in values for the prompt
        parameter. In this case it prompts the user login even if they have
        already signed in. the list of supported values depends on the
        identity provider

        ```dart
        final AuthorizationTokenResponse result = await _appAuth
        .authorizeAndExchangeCode(
          AuthorizationTokenRequest(_clientId, _redirectUrl,
              serviceConfiguration: _serviceConfiguration,
              scopes: _scopes,
              promptValues: ['login']),
        );
        ```
      */

      _processAuthTokenResponse(result);
      print(4);
      await _testApi(result);
    } catch (e) {
      print(e.toString());
      _handleError(e);
    } finally {
      _clearBusyState();
    }
  }

  void _processAuthTokenResponse(AuthorizationTokenResponse response) {
    setState(() {
      _accessToken = response.accessToken!;
      _idToken = response.idToken!;
      _refreshToken = response.refreshToken!;
      // _accessTokenExpirationTextController.text = response
      //     .accessTokenExpirationDateTime!
      //     .toIso8601String();
    });
  }

  void _handleError(Object e) {
    if (e is FlutterAppAuthUserCancelledException) {
      setState(() {
        _error = 'The user cancelled the flow!';
      });
    } else if (e is FlutterAppAuthPlatformException) {
      setState(() {
        _error = e.platformErrorDetails.toString();
      });
    } else if (e is PlatformException) {
      setState(() {
        _error =
            'Error\n\nCode: ${e.code}\nMessage: ${e.message}\n'
            'Details: ${e.details}';
      });
    } else {
      setState(() {
        _error = 'Error: $e';
      });
    }
  }

  void _clearBusyState() {
    setState(() {
      _isBusy = false;
    });
  }

  void _setBusyState() {
    setState(() {
      _error = '';
      _isBusy = true;
    });
  }

  Future<void> _testApi(AuthorizationTokenResponse result) async {
    // TODO
    print('TEST');
  }
}
