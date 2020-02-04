import { models } from '../../src/database';

export default async () => {
  Promise.all(
    models.map(model => {
      model.destroy({ truncate: true, force: true });
    })
  );
};
