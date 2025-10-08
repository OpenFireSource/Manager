import 'package:flutter/material.dart';
import 'package:mobile_app/core/constants/constants.dart';

class MyDivider extends StatelessWidget {
  const MyDivider({super.key});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 8.0),
      child: Divider(color: dividerColor, height: 3),
    );
  }
}
