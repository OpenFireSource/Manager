import 'package:flutter/material.dart';

class ImprintScreen extends StatelessWidget {
  const ImprintScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('App Informationen')),
      body: Text('Impressum'),
    );
  }
}
