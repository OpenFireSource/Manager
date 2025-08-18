import 'package:flutter/material.dart';
import 'package:mobile_app/features/home/presentation/widgets/home_drawer_header.dart';
import 'package:mobile_app/features/home/presentation/widgets/home_drawer_list.dart';

class HomeDrawer extends StatelessWidget {
  const HomeDrawer({super.key});

  @override
  Widget build(BuildContext context) {
    return Drawer(
      child: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            const HomeDrawerHeader(),
            const HomeDrawerList(),
          ],
        ),
      ),
    );
  }
}
