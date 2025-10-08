import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:mobile_app/core/data/repositories/authentication_repo.dart';
import 'package:mobile_app/features/base/bloc/locations/locations_bloc.dart';
import 'package:mobile_app/features/base/bloc/locations/locations_event.dart';
import 'package:mobile_app/features/base/bloc/locations/locations_state.dart';
import 'package:mobile_app/features/base/presentation/widgets/locations_list.dart';
import 'package:mobile_app/features/base/presentation/widgets/locations_loading.dart';
import 'package:mobile_app/shared/widgets/has_role.dart';

class LocationsScreen extends StatelessWidget {
  const LocationsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (ctx) =>
          LocationsBloc(backendClient: ctx.getBackendClient())
            ..add(LocationsInitial()),
      child: Scaffold(
        appBar: AppBar(
          title: Text('Fahrzeuge / Orte'),
          actions: [
            HasRole(
              role: 'location.manage',
              child: BlocBuilder<LocationsBloc, LocationsState>(
                builder: (context, state) => IconButton(
                  onPressed: state.loading ? null : () {},
                  icon: Icon(Icons.add),
                ),
              ),
            ),
          ],
        ),
        body: BlocBuilder<LocationsBloc, LocationsState>(
          builder: (context, state) => state.loading && state.items.isEmpty
              ? LocationsLoading()
              : LocationsList(),
        ),
      ),
    );
  }
}
