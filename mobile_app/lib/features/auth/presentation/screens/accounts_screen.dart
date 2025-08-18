import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import 'package:mobile_app/core/bloc/organisation/organisation_bloc.dart';
import 'package:mobile_app/core/bloc/organisation/organisation_event.dart';
import 'package:mobile_app/core/bloc/organisation/organisation_state.dart';
import 'package:mobile_app/core/data/models/organisation_model.dart';
import 'package:mobile_app/features/auth/auth_routes.dart';

class AccountsScreen extends StatelessWidget {
  const AccountsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Accounts'),
        actions: [
          IconButton(
            onPressed: () => context.push(addOrganisationScreen),
            icon: Icon(Icons.add),
          ),
        ],
      ),
      body: BlocBuilder<OrganisationBloc, OrganisationState>(
        builder: (BuildContext context, OrganisationState state) =>
            state is OrganisationSelectedState
            ? ListView.separated(
                itemBuilder: (context, i) => ListTile(
                  isThreeLine: false,
                  title: Text(getOrganisation(state, i)!.name),
                  subtitle:
                      getOrganisation(state, i)!.loginStatus ==
                          LoginStatus.loggedin
                      ? null
                      : Text('abgemeldet'),
                  subtitleTextStyle: Theme.of(context).textTheme.bodySmall,
                  trailing: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      IconButton(
                        onPressed: () => context.read<OrganisationBloc>().add(
                          OrganisationRemoveEvent(
                            getOrganisation(state, i)!.id,
                          ),
                        ),
                        icon: Icon(Icons.delete_outline_outlined),
                      ),
                      IconButton(
                        onPressed: () => context.read<OrganisationBloc>().add(
                          OrganisationSelectedEvent(
                            id: getOrganisation(state, i)!.id,
                          ),
                        ),
                        icon: Icon(
                          state.selectedOrganisation.id ==
                                  getOrganisation(state, i)?.id
                              ? Icons.star
                              : Icons.star_outline,
                        ),
                      ),
                    ],
                  ),
                ),
                separatorBuilder: (context, index) => Divider(
                  color: Colors.black12,
                  indent: 15,
                  endIndent: 20,
                  height: 0,
                ),
                itemCount: state.organisations.length,
              )
            : Center(child: CircularProgressIndicator()),
      ),
    );
  }

  OrganisationModel? getOrganisation(OrganisationSelectedState state, int i) =>
      state.organisations[state.organisations.keys.toList()[i]];
}
