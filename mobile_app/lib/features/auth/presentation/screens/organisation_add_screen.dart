import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:mobile_app/core/bloc/organisation/organisation_bloc.dart';
import 'package:mobile_app/core/bloc/organisation/organisation_event.dart';

class OrganisationAddScreen extends StatelessWidget {
  const OrganisationAddScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Add Organisation")),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: ListView(
          children: [
            TextButton(
              onPressed: () => context.read<OrganisationBloc>().add(
                OrganisationAddEvent(name: 'Test', serverUrl: 'http://localhost:3000'),
              ),
              child: Text('Add Organisation'),
            ),
          ],
        ),
      ),
    );
  }
}
