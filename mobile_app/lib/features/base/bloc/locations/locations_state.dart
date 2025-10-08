import 'package:backend_client/backend_client.dart';
import 'package:equatable/equatable.dart';

class LocationsState extends Equatable {
  final bool loading;
  final bool error;
  final String errorMessage;

  final String sortedColumn;
  final String sortDirection;
  final String searchTerm;

  final int total;
  final int page;
  final List<LocationDto> items;

  const LocationsState({
    required this.loading,
    required this.error,
    required this.total,
    required this.page,
    required this.errorMessage,
    required this.sortedColumn,
    required this.sortDirection,
    required this.searchTerm,
    required this.items,
  });

  LocationsState copyWith({
    bool? loading,
    bool? error,
    int? total,
    int? page,
    String? errorMessage,
    String? sortedColumn,
    String? sortDirection,
    String? searchTerm,
    List<LocationDto>? items,
  }) => LocationsState(
    loading: loading ?? this.loading,
    error: error ?? this.error,
    total: total ?? this.total,
    page: page ?? this.page,
    errorMessage: errorMessage ?? this.errorMessage,
    sortedColumn: sortedColumn ?? this.sortedColumn,
    sortDirection: sortDirection ?? this.sortDirection,
    searchTerm: searchTerm ?? this.searchTerm,
    items: items ?? this.items,
  );

  @override
  List<Object?> get props => [
    loading,
    error,
    errorMessage,
    sortedColumn,
    sortDirection,
    searchTerm,
    total,
    page,
    items,
  ];
}
