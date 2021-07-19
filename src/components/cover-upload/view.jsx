import { h } from 'hyperapp';
import $ from 'mdui.jq';
import mdui from 'mdui';
import { COMMON_IMAGE_UPLOAD_FAILED } from 'mdclub-sdk-js/es/errors';
import { uploadMyCover } from 'mdclub-sdk-js/es/UserApi';
import { loadStart, loadEnd } from '~/utils/loading';
import { emit } from '~/utils/pubsub';
import apiCatch from '~/utils/errorHandler';
import './index.less';

const upload = (e, user) => {
  const file = e.target.files[0];

  if (file.size > 15 * 1024 * 1024) {
    mdui.snackbar('封面文件不能超过 15M');
    e.target.value = '';
    return;
  }

  if (['image/png', 'image/jpeg'].indexOf(file.type) < 0) {
    mdui.snackbar('只能上传 png、jpg 格式的图片');
    e.target.value = '';
    return;
  }

  loadStart();

  uploadMyCover({ cover: file })
    .finally(loadEnd)
    .then(({ data }) => {
      user.cover = data;
      emit('user_update', user);
    })
    .catch((response) => {
      if (response.code === COMMON_IMAGE_UPLOAD_FAILED) {
        mdui.snackbar(response.extra_message);
        return;
      }

      apiCatch(response);
    });
};

export default ({ user }) => (
  <div class="mc-cover-upload">
    <button
      onclick={(e) => {
        $(e.currentTarget).next().val('').trigger('click');
      }}
      class="upload-btn mdui-btn mdui-btn-icon mdui-ripple"
      type="button"
      title="点击上传封面"
    >
      <i className="mdui-icon material-icons">photo_camera</i>
    </button>
    <input
      onchange={(e) => upload(e, user)}
      type="file"
      title=" "
      accept="image/jpeg,image/png"
    />
  </div>
);
