import 'package:flutter/material.dart';

class PageIndicator extends StatelessWidget {
  final int pageCount, currentPage;
  final Color? activeColor, inactiveColor;

  const PageIndicator({
    super.key,
    required this.pageCount,
    required this.currentPage,
    this.activeColor,
    this.inactiveColor,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: List.generate(
        pageCount,
        (index) => AnimatedContainer(
          duration: const Duration(milliseconds: 300),
          margin: const EdgeInsets.symmetric(horizontal: 5),
          width: currentPage == index ? 20 : 10,
          height: 10,
          decoration: BoxDecoration(
            color: currentPage == index
                ? (activeColor ?? Colors.blue)
                : (inactiveColor ?? Colors.grey),
            borderRadius: BorderRadius.circular(5),
          ),
        ),
      ),
    );
  }
}
