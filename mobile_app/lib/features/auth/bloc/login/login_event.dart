import 'package:equatable/equatable.dart';

abstract class LoginEvent extends Equatable {
  @override
  List<Object?> get props => [];
}

class LoginServerUrlChanged extends LoginEvent {
  final String serverUrl;

  LoginServerUrlChanged(this.serverUrl);

  @override
  List<Object?> get props => [serverUrl];
}

class LoginSubmitted extends LoginEvent {}