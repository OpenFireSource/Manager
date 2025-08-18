import 'package:backend_client/backend_client.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:mobile_app/features/home/bloc/home_drawer_header/home_drawer_header_event.dart';
import 'package:mobile_app/features/home/bloc/home_drawer_header/home_drawer_header_state.dart';

class HomeDrawerHeaderBloc
    extends Bloc<HomeDrawerHeaderEvent, HomeDrawerHeaderState> {
  final BackendClient _backendClient;

  HomeDrawerHeaderBloc({required BackendClient backendClient})
    : _backendClient = backendClient,
      super(HomeDrawerHeaderState(loading: true, profile: null, error: false)) {
    on<HomeDrawerHeaderLoadEvent>(_onHomeDrawerHeaderLoadEvent);
  }

  _onHomeDrawerHeaderLoadEvent(
    HomeDrawerHeaderLoadEvent event,
    Emitter<HomeDrawerHeaderState> emit,
  ) async {
    emit(HomeDrawerHeaderState(loading: true, profile: null, error: false));

    // Profil-Daten laden
    final response = await _backendClient.getUserApi().userControllerGetMe();
    if (response.data != null) {
      emit(
        HomeDrawerHeaderState(
          loading: false,
          profile: response.data,
          error: false,
        ),
      );
    } else {
      emit(HomeDrawerHeaderState(loading: false, profile: null, error: true));
    }
  }
}
