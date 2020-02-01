import Avatar from '../models/Avatar';
import Deliveryman from '../models/Deliveryman';

class AvatarController {
  async store(req, res) {
    const { id } = req.params;
    const { originalname: name, filename: path } = req.file;

    const deliveryman = await Deliveryman.findOne({
      where: {
        id,
      },
    });

    if (!deliveryman) {
      return res.status(400).json({
        error: 'Deliveryman not found',
      });
    }

    const avatar = await Avatar.create({
      name,
      path,
    });

    if (!avatar) {
      return res.status(500).json({
        error: 'Internal server error',
      });
    }

    await deliveryman.update({
      avatar_id: avatar.id,
    });

    return res.json(deliveryman);
  }
}

export default new AvatarController();
