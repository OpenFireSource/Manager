import 'package:equatable/equatable.dart';

class LoginState extends Equatable {
  final String serverUrl;
  final bool isBusy;
  final String? accessToken;
  final String? idToken;
  final String? refreshToken;
  final String? error;

  const LoginState({
    this.serverUrl = 'https://localhost:20443/realms/openfiresource',
    this.isBusy = false,
    this.accessToken,
    this.idToken,
    this.refreshToken,
    this.error,
  });

  LoginState copyWith({
    String? serverUrl,
    bool? isBusy,
    String? accessToken,
    String? idToken,
    String? refreshToken,
    String? error,
  }) {
    return LoginState(
      serverUrl: serverUrl ?? this.serverUrl,
      isBusy: isBusy ?? this.isBusy,
      accessToken: accessToken ?? this.accessToken,
      idToken: idToken ?? this.idToken,
      refreshToken: refreshToken ?? this.refreshToken,
      error: error,
    );
  }

  @override
  List<Object?> get props => [
    serverUrl,
    isBusy,
    accessToken,
    idToken,
    refreshToken,
    error,
  ];
}