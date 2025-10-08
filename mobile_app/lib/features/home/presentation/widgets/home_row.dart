import 'package:flutter/material.dart';

enum RowState { ok, warning, critical }

class HomeRow extends StatelessWidget {
  final String title;
  final RowState? state;

  const HomeRow({super.key, required this.title, this.state});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(10, 10, 0, 0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              if (state != null)
                Padding(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 4,
                    vertical: 8,
                  ),
                  child: Container(
                    width: 11,
                    height: 11,
                    decoration: BoxDecoration(
                      color: _getColor(state!),
                      shape: BoxShape.circle,
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withValues(
                            alpha: 0.3,
                          ), // Schattenfarbe
                          spreadRadius: 0.6, // Ausdehnung des Schattens
                          blurRadius: 5, // Weichzeichnung des Schattens
                          offset: Offset(
                            2,
                            2,
                          ), // Verschiebung des Schattens (x, y)
                        ),
                      ],
                    ),
                  ),
                ),
              Text(title, style: Theme.of(context).textTheme.titleMedium),
            ],
          ),
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            child: Row(
              children: [
                Card(child: Placeholder(fallbackHeight: 50, fallbackWidth: 50)),
                Card(child: Placeholder(fallbackHeight: 50, fallbackWidth: 50)),
                Card(child: Placeholder(fallbackHeight: 50, fallbackWidth: 50)),
                Card(child: Placeholder(fallbackHeight: 50, fallbackWidth: 50)),
                Card(child: Placeholder(fallbackHeight: 50, fallbackWidth: 50)),
                Card(child: Placeholder(fallbackHeight: 50, fallbackWidth: 50)),
                Card(child: Placeholder(fallbackHeight: 50, fallbackWidth: 50)),
                Card(child: Placeholder(fallbackHeight: 50, fallbackWidth: 50)),
                Card(child: Placeholder(fallbackHeight: 50, fallbackWidth: 50)),
                Card(child: Placeholder(fallbackHeight: 50, fallbackWidth: 50)),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Color _getColor(RowState state) {
    switch (state) {
      case RowState.ok:
        return Colors.green;
      case RowState.warning:
        return Colors.orange;
      case RowState.critical:
        return Colors.red;
    }
  }
}
