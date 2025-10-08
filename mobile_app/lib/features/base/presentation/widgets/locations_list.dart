import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:mobile_app/features/base/bloc/locations/locations_bloc.dart';
import 'package:mobile_app/features/base/bloc/locations/locations_event.dart';
import 'package:mobile_app/features/base/bloc/locations/locations_state.dart';
import 'package:mobile_app/features/base/presentation/widgets/locations_list_item.dart';

class LocationsList extends StatefulWidget {
  const LocationsList({super.key});

  @override
  State<StatefulWidget> createState() => _LocationsListState();
}

class _LocationsListState extends State<LocationsList> {
  final _scrollController = ScrollController();

  @override
  void initState() {
    super.initState();
    _scrollController.addListener(_loadMore);
  }

  @override
  void dispose() {
    _scrollController.dispose();
    super.dispose();
  }

  void _loadMore() {
    if (_scrollController.position.pixels ==
        _scrollController.position.maxScrollExtent) {
      BlocProvider.of<LocationsBloc>(context).add(LocationsLoadMore());
    }
  }

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<LocationsBloc, LocationsState>(
      builder: (context, state) =>
          ListView.builder(
            controller: _scrollController,
            itemCount: state.items.length + (state.loading ? 1 : 0),
            itemBuilder: (context, index) =>
            state.items.length == index
                ? Center(child: CircularProgressIndicator())
                : LocationsListItem(data: state.items[index]),
          ),
    );
  }
}
