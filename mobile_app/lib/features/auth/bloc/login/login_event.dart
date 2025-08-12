import 'package:equatable/equatable.dart';

abstract class LoginEvent extends Equatable {
  @override
  List<Object?> get props => [];
}

class LoginSubmitted extends LoginEvent {
  final String serverUrl;

  LoginSubmitted(this.serverUrl);

  @override
  List<Object?> get props => [serverUrl];
}