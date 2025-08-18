import 'package:backend_client/backend_client.dart';
import 'package:equatable/equatable.dart';

class HomeDrawerHeaderState extends Equatable {
  final UserDto? profile;
  final bool loading;
  final bool error;

  const HomeDrawerHeaderState({
    required this.profile,
    required this.loading,
    required this.error,
  });

  @override
  List<Object?> get props => [profile, loading, error];
}
