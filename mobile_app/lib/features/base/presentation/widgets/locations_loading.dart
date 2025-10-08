import 'package:flutter/material.dart';
import 'package:skeletonizer/skeletonizer.dart';

class LocationsLoading extends StatelessWidget {
  const LocationsLoading({super.key});

  @override
  Widget build(BuildContext context) {
    return Skeletonizer(
      enabled: true,
      child: ListView.builder(
        itemCount: 7,
        itemBuilder: (context, index) {
          return Card(
            child: ListTile(
              title: Text('Lorem ipsum Lorem'),
              subtitle: const Text('Lorem ipsum'),
              trailing: const Icon(Icons.ac_unit),
            ),
          );
        },
      ),
    );
  }
}
