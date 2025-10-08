import 'package:flutter/material.dart';

class NotFoundScreen extends StatelessWidget {
  const NotFoundScreen({super.key});

  @override
  Widget build(BuildContext context) {
    // TODO mehr Inhalt und vielleicht eine Grafik
    return Scaffold(
      appBar: AppBar(title: Text('Seite nicht gefunden'),),
      body: Center(child: Text("Upps! Da ist was schief gegangen.")),
    );
  }
}
