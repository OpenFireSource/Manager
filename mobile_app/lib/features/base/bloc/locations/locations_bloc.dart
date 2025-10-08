import 'package:backend_client/backend_client.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:mobile_app/core/constants/constants.dart';
import 'package:mobile_app/features/base/bloc/locations/locations_event.dart';
import 'package:mobile_app/features/base/bloc/locations/locations_state.dart';

class LocationsBloc extends Bloc<LocationsEvent, LocationsState> {
  final BackendClient _backendClient;

  LocationsBloc({required BackendClient backendClient})
    : _backendClient = backendClient,
      super(
        const LocationsState(
          searchTerm: '',
          sortDirection: '',
          sortedColumn: '',
          errorMessage: '',
          total: 0,
          error: false,
          loading: true,
          page: 0,
          items: [],
        ),
      ) {
    on<LocationsInitial>(_onLocationLoad);
    on<LocationsLoadMore>(_onLocationLoadMore);
  }

  Future<void> _onLocationLoad(
    LocationsInitial event,
    Emitter<LocationsState> emit,
  ) async {
    try {
      final count = await _backendClient
          .getLocationApi()
          .locationControllerGetCount();
      final items = await _backendClient
          .getLocationApi()
          .locationControllerGetAll(limit: itemsPerPage);
      emit(
        state.copyWith(
          loading: false,
          error: false,
          errorMessage: '',
          page: 0,
          total: count.data!.count.toInt(),
          items: items.data!.toList(),
        ),
      );
    } catch (e) {
      emit(
        state.copyWith(
          loading: false,
          error: true,
          errorMessage: 'Fehler beim laden',
        ),
      );
    }
  }

  Future<void> _onLocationLoadMore(
    LocationsLoadMore event,
    Emitter<LocationsState> emit,
  ) async {
    emit(state.copyWith(loading: true));
    try {
      final count = await _backendClient
          .getLocationApi()
          .locationControllerGetCount();
      final items = await _backendClient
          .getLocationApi()
          .locationControllerGetAll(
            limit: itemsPerPage,
            offset: (state.page + 1) * itemsPerPage,
          );
      emit(
        state.copyWith(
          loading: false,
          error: false,
          errorMessage: '',
          page: state.page + 1,
          total: count.data!.count.toInt(),
          items: state.items..addAll(items.data!.toList()),
        ),
      );
    } catch (e) {
      emit(
        state.copyWith(
          loading: false,
          error: true,
          errorMessage: 'Fehler beim laden',
        ),
      );
    }
  }
}
