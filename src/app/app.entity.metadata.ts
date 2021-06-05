import {EntityMetadataMap} from '@ngrx/data';
import {Location} from './model/Location';

export const appEntityMetadata: EntityMetadataMap = {
  Location: {
    selectId: (location: Location) => location.locationId,
  },

};
