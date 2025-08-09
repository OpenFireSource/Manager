import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_appauth/flutter_appauth.dart';
import 'package:mobile_app/features/auth/bloc/login/login_event.dart';
import 'package:mobile_app/features/auth/bloc/login/login_state.dart';

class LoginBloc extends Bloc<LoginEvent, LoginState> {
  final FlutterAppAuth appAuth;

  static const _clientId = 'mobile-app';
  static const _redirectUrl = 'name.vonkirschbaum.manager:/oauthredirect';
  static const _scopes = [
    'openid', 'profile', 'email', 'offline_access'
  ];

  LoginBloc({required this.appAuth}) : super(const LoginState()) {
    on<LoginServerUrlChanged>(_onServerUrlChanged);
    on<LoginSubmitted>(_onLoginSubmitted);
  }

  void _onServerUrlChanged(LoginServerUrlChanged event, Emitter<LoginState> emit) {
    emit(state.copyWith(serverUrl: event.serverUrl, error: null));
  }

  Future<void> _onLoginSubmitted(LoginSubmitted event, Emitter<LoginState> emit) async {
    if (state.serverUrl.trim().isEmpty) {
      emit(state.copyWith(error: "Bitte Server-URL eingeben."));
      return;
    }

    emit(state.copyWith(isBusy: true, error: null, accessToken: null, refreshToken: null, idToken: null));

    try {
      final discoveryUrl = "${state.serverUrl.replaceAll(RegExp(r'/$'), '')}/.well-known/openid-configuration";
      final AuthorizationTokenResponse? result =
      await appAuth.authorizeAndExchangeCode(
        AuthorizationTokenRequest(
          _clientId,
          _redirectUrl,
          discoveryUrl: discoveryUrl,
          scopes: _scopes,
        ),
      );
      if (result != null) {
        emit(state.copyWith(
          accessToken: result.accessToken,
          idToken: result.idToken,
          refreshToken: result.refreshToken,
          isBusy: false,
        ));
      } else {
        emit(state.copyWith(isBusy: false, error: "Kein Token erhalten."));
      }
    } catch (e) {
      emit(state.copyWith(isBusy: false, error: e.toString()));
    }
  }
}