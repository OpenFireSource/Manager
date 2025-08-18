import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:mobile_app/core/bloc/organisation/organisation_bloc.dart';
import 'package:mobile_app/core/bloc/organisation/organisation_state.dart';
import 'package:mobile_app/core/data/repositories/authentication_repo.dart';
import 'package:mobile_app/features/home/bloc/home_drawer_header/home_drawer_header_bloc.dart';
import 'package:mobile_app/features/home/bloc/home_drawer_header/home_drawer_header_event.dart';
import 'package:mobile_app/features/home/bloc/home_drawer_header/home_drawer_header_state.dart';

class HomeDrawerHeader extends StatelessWidget {
  const HomeDrawerHeader({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocProvider<HomeDrawerHeaderBloc>(
      create: (BuildContext ctx) =>
          HomeDrawerHeaderBloc(backendClient: ctx.getBackendClient())
            ..add(HomeDrawerHeaderLoadEvent()),
      child: Material(
        color: Theme.of(context).primaryColor,
        child: Container(
          padding: EdgeInsets.only(
            top: MediaQuery.of(context).padding.top,
            bottom: 24,
          ),
          child: Column(
            children: [
              BlocBuilder<HomeDrawerHeaderBloc, HomeDrawerHeaderState>(
                builder: (context, state) => state.error
                    ? Text('Fehler beim laden')
                    : state.profile == null || state.loading
                    ? CircularProgressIndicator()
                    : Text(
                        '${state.profile!.firstName} ${state.profile!.lastName}',
                        style: TextStyle(fontSize: 28, color: Colors.white),
                      ),
              ),
              BlocBuilder<OrganisationBloc, OrganisationState>(
                builder: (context, state) => Text(
                  state is! OrganisationSelectedState
                      ? 'unbekannt'
                      : state.selectedOrganisation.name,
                  style: TextStyle(fontSize: 14, color: Colors.white),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
