import 'package:backend_client/backend_client.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:mobile_app/features/base/base_routes.dart';

class LocationsListItem extends StatelessWidget {
  final LocationDto data;

  const LocationsListItem({super.key, required this.data});

  @override
  Widget build(BuildContext context) {
    return ListTile(
      contentPadding: const EdgeInsets.symmetric(vertical: 5, horizontal: 15),
      title: Text.rich(
        TextSpan(
          children: [
            TextSpan(
              text: data.name,
              style: const TextStyle(
                fontWeight: FontWeight.bold,
                color: Colors.black,
              ),
            ),
            if (data.parent != null)
              TextSpan(
                text:
                    ' (${data.parent!.name}${data.parent?.parent != null ? ' -> ${data.parent!.parent!.name}' : ''})',
                style: const TextStyle(
                  fontWeight: FontWeight.normal,
                  color: Colors.grey,
                ),
              ),
          ],
        ),
        softWrap: true,
        overflow: TextOverflow.visible,
      ),
      subtitle: Text(_getTypeText(data)),
      leading: Icon(_getTypeIcon(data), size: 32),
      trailing: Icon(Icons.arrow_forward_ios, size: 16),
      onTap: () async =>
          await context.push(locationsScreenDetail(data.id.toInt())),
    );
  }

  IconData _getTypeIcon(LocationDto data) {
    // TODO #1 general icons
    switch (data.type.toInt()) {
      case 1:
        return Icons.location_on;
      case 2:
        return Icons.home;
      case 3:
        return Icons.home_outlined;
      case 4:
        return Icons.garage_outlined;
      case 100:
        return Icons.directions_car;
      case 101:
        return Icons.question_mark_outlined;
      case 102:
        return Icons.question_mark_outlined;
      case 0:
      default:
        return Icons.question_mark_outlined;
    }
  }

  String _getTypeText(LocationDto data) {
    switch (data.type.toInt()) {
      case 1:
        return 'Standort';
      case 2:
        return 'Gebäude';
      case 3:
        return 'Gebäudeteil';
      case 4:
        return 'Garage';
      case 100:
        return 'Fahrzeug';
      case 101:
        return 'Container';
      case 102:
        return 'Anhänger';
      case 0:
      default:
        return 'keine Angabe';
    }
  }
}
