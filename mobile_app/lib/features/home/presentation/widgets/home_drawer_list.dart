import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:mobile_app/features/app_info/app_info_routes.dart';
import 'package:mobile_app/features/auth/auth_routes.dart';

class HomeDrawerList extends StatelessWidget {
  const HomeDrawerList({super.key});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        ListTile(
          leading: Icon(Icons.account_circle_outlined),
          title: Text('Accounts'),
          onTap: () async {
            context.pop();
            await context.push(accountsScreen);
          },
        ),
        ListTile(
          leading: Icon(Icons.settings_outlined),
          title: Text('Einstellungen'),
          onTap: () {},
        ),
        const Divider(color: Colors.black45),
        ListTile(
          leading: Icon(Icons.info_outline),
          title: Text('App Informationen'),
          onTap: () async {
            context.pop();
            await context.push(appInfoImprintScreen);
          },
        ),
      ],
    );
  }
}
