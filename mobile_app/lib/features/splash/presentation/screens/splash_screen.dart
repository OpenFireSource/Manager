import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<StatefulWidget> createState() => SplashScreenState();
}

class SplashScreenState extends State<SplashScreen> {
  @override
  void initState() {
    super.initState();
    Future.delayed(const Duration(seconds: 2), () {
      // TODO wenn bereits eingeloggt dann zu home, sonst zum onboarding
      //context.go('/onboarding'); // oder: prüfe Login und ggf. weiterleiten
    });
  }

  @override
  Widget build(BuildContext context) {
    return const Scaffold(
      backgroundColor: Color(0xFF2255A4),
      body: Center(
        child: Text('SPLASH'),
        // child: Image.asset('assets/splash_logo.png', width: 120),
      ),
    );
  }
}
