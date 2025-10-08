import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:mobile_app/core/bloc/organisation/organisation_bloc.dart';
import 'package:mobile_app/core/bloc/organisation/organisation_state.dart';
import 'package:mobile_app/features/home/presentation/widgets/home_drawer.dart';
import 'package:mobile_app/features/home/presentation/widgets/home_row.dart';
import 'package:mobile_app/shared/widgets/has_role.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Status')),
      drawer: const HomeDrawer(),
      body: ListView(
        children: [
          /*HomeRow(title: 'Fällige Geräte', state: RowState.ok),
          HomeRow(title: 'Fällige Geräte', state: RowState.warning),
          BlocBuilder<OrganisationBloc, OrganisationState>(
            builder: (context, state) =>
                state is OrganisationSelectedState && state.roles != null
                ? ListView.builder(
                  shrinkWrap: true,
                    physics: NeverScrollableScrollPhysics(),
                    itemCount: state.roles!.length,
                    itemBuilder: (context, index) =>
                        ListTile(title: Text(state.roles![index])),
                  )
                : Text('Keine Roles bekannt'),
          ),*/
        ],
      ),
    );
  }
}
