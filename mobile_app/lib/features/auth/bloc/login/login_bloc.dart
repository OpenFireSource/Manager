import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_appauth/flutter_appauth.dart';
import 'package:mobile_app/core/data/repositories/authentication_repo.dart';
import 'package:mobile_app/core/utils/debug.dart';
import 'package:mobile_app/features/auth/bloc/login/login_event.dart';
import 'package:mobile_app/features/auth/bloc/login/login_state.dart';

class LoginBloc extends Bloc<LoginEvent, LoginState> {
  final FlutterAppAuth _appAuth;
  final AuthenticationRepo _authenticationRepo;

  static const _clientId = 'mobile-app';
  static const _redirectUrl = 'de.cordol.app:/oauthredirect';
  static const _scopes = ['openid', 'profile', 'email', 'offline_access'];

  LoginBloc({
    required FlutterAppAuth appAuth,
    required AuthenticationRepo authenticationRepo,
  }) : _appAuth = appAuth,
       _authenticationRepo = authenticationRepo,
       super(const LoginState()) {
    on<LoginSubmitted>(_onLoginSubmitted);
  }

  Future<void> _onLoginSubmitted(
    LoginSubmitted event,
    Emitter<LoginState> emit,
  ) async {
    emit(
      state.copyWith(
        isBusy: true,
        error: null,
        accessToken: null,
        refreshToken: null,
        idToken: null,
      ),
    );

    final data = await _authenticationRepo.getServerInfo(event.serverUrl);
    if (data == null) {
      emit(
        state.copyWith(
          isBusy: false,
          error: 'Fehler beim erreichen des Login-Servers',
        ),
      );
      return;
    }

    try {
      final discoveryUrl =
          "${data.keycloakUrl.replaceAll(RegExp(r'/$'), '')}/.well-known/openid-configuration";
      final AuthorizationTokenResponse result = await _appAuth
          .authorizeAndExchangeCode(
            AuthorizationTokenRequest(
              _clientId,
              _redirectUrl,
              discoveryUrl: discoveryUrl,
              scopes: _scopes,
            ),
          );
      emit(
        state.copyWith(
          accessToken: result.accessToken,
          idToken: result.idToken,
          refreshToken: result.refreshToken,
          isBusy: false,
        ),
      );
    } catch (e) {
      debug(e.toString());
      emit(state.copyWith(isBusy: false, error: "Login war nicht erfolgreich!"));
    }
  }
}
