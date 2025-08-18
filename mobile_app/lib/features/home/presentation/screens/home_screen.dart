import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:mobile_app/core/bloc/organisation/organisation_bloc.dart';
import 'package:mobile_app/core/bloc/organisation/organisation_event.dart';
import 'package:mobile_app/core/bloc/organisation/organisation_state.dart';
import 'package:mobile_app/core/data/repositories/authentication_repo.dart';
import 'package:mobile_app/features/home/presentation/widgets/home_drawer.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Home')),
      drawer: const HomeDrawer(),
      body: Column(
        children: [
          BlocBuilder<OrganisationBloc, OrganisationState>(
            buildWhen: (previous, current) =>
                current is OrganisationSelectedState,
            builder: (context, state) => Text(
              (state as OrganisationSelectedState).selectedOrganisation.name,
            ),
          ),
          BlocBuilder<OrganisationBloc, OrganisationState>(
            buildWhen: (previous, current) =>
                current is OrganisationSelectedState,
            builder: (context, state) => TextButton(
              onPressed: () => context.read<OrganisationBloc>().add(
                OrganisationRemoveEvent(
                  (state as OrganisationSelectedState).selectedOrganisation.id,
                ),
              ),
              child: Text('Remove'),
            ),
          ),
          BlocBuilder<OrganisationBloc, OrganisationState>(
            buildWhen: (previous, current) =>
                current is OrganisationSelectedState,
            builder: (context, state) => TextButton(
              onPressed: () => context.read<OrganisationBloc>().add(
                OrganisationLogoutEvent(
                  (state as OrganisationSelectedState).selectedOrganisation.id,
                ),
              ),
              child: Text('Logout'),
            ),
          ),
          FutureBuilder(
            future: context
                .getBackendClient()
                .getUserApi()
                .userControllerGetMe(),
            builder: (context, snapshot) {
              if (snapshot.hasData) {
                return Text(snapshot.data?.data?.lastName ?? 'ABC');
              }
              if (snapshot.hasError) {
                return Text(snapshot.error.toString());
              }
              return Text('Loading');
            },
          ),
        ],
      ),
    );
  }
}
