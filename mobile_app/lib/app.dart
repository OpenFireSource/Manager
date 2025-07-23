import 'package:flutter/material.dart';
import 'package:mobile_app/routes/app_router.dart';
import 'package:mobile_app/core/theme/app_theme.dart';

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp.router(
      debugShowCheckedModeBanner: false,
      theme: AppTheme.light,
      darkTheme: AppTheme.dark,
      routerConfig: AppRouter.router,
      title: 'Manager',
      locale: const Locale('de'),
    );
  }
}
