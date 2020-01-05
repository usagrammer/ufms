document.addEventListener('turbolinks:load', function () {

  if (!$('#selected-item-images')[0]) return false; //カテゴリのフォームがないなら以降実行しない。

  const item_images_limit = 5; //添付できる画像の枚数
  const form = $("form"); //form要素を変数に入れておく。

  var file_list = [];

  function selectedImage(files, type) { //選択した画像のプレビューを表示したり新しくfile_fieldを作成したりする。
    if (item_images_limit < $(".item-image__image").length + files.length) { // 画像の枚数制限をオーバーするならキャンセル
      alert("画像が多すぎます。");
      return false;
    }
    Array.prototype.forEach.call(files, function (file) { // ドロップされたファイルを取り出して処理していく。
      if (file.type.indexOf('image/') != 0) return false; // ドロップされたファイルが画像でないならスキップする。
      let index = $(".new-item-image:last")[0].dataset.index //何番目の画像か
      let blob = window.URL.createObjectURL(file); //選択された画像をblob形式に変換する。
      //↑このblobをsrc属性値として使ったimgタグを表示することで、投稿画像のプレビュー機能になる。
      buildImagePreview(blob, index); // 選択された画像のプレビューを表示する。
      newUploadItemImageField(); //新規画像投稿用のfile_fieldを組み立ててappendする。
      let file_field = $(`.new-item-image[data-index="${index}"]`);
      file_list.push({
        index: index,
        name: file_field.attr("name"),
        data: file
      });
      file_field.attr("name", "");
      file_field[0].dataset.type = type;
    });
  }
  /////////selectedImage()ここまで/////////

  function buildImagePreview(blob, index) { //選択した画像ファイルのプレビューを表示する。
    html = `
            <div class="item-image new" data-index=${index}>
              <img src =${blob} class="item-image__image">
              <div class="item-image__buttons">
                <div class="item-image__buttons--edit">
                編集
                </div>
                <div class="item-image__buttons--delete">
                削除
                </div>
              </div>
            </div>
            `;
    $("#select-image-button").before(html);
  }
  /////////buildImagePreview()ここまで/////////

  function newUploadItemImageField() { //新規画像投稿用のfile_fieldを作成しappendする。
    let new_file_field_index = $(`.new-item-image`).last()[0].dataset.index
    // Numberメソッド→引数を数値に変換する
    // datasetメソッドで取得すると全て文字列になってしまうためこうする
    // dataメソッドならこれをやる必要はない
    new_file_field_index = Number(new_file_field_index) + 1;
    let html = `
                <input class="new-item-image" id="file_field_index_${new_file_field_index}" name="item[item_images_attributes][${new_file_field_index}][image]" accept="image/*" type="file" data-index="${new_file_field_index}" multiple="multiple" >
              `
    $("#image-file-fields").append(html);
  }
  /////////newUploadItemImageField()ここまで/////////

  function newChangeItemImageField() { //画像変更用のfile_fieldを作成しappendする。
    let html = `<input id="change-item-image" accept="image/*" data-index="" type="file" name="">` // 新しく画像変更用のfile_fieldを組み立てる。
    $("#image-file-fields").append(html); //新しい画像変更用のfile_fieldをappendする。
  }
  /////////newChangeItemImageField()ここまで/////////

  ///////////////////////////////////////////////////////////////
  /////////画像の投稿ボタン（グレーのブロック）をクリックした時。/////////
  ///////////////////////////////////////////////////////////////
  $("#select-image-button").on("click", function () {
    if ($(".item-image__image").length >= item_images_limit) { //プレビュー画像のlength＝UPされた画像の枚数。画像枚数の上限に引っかかる場合はここで終了。
      alert("これ以上画像UPできません ");
      return false;
    }
    let file_field = $(`.new-item-image`).last(); // 新規画像投稿用の最後のfile_fieldを取得する。
    file_field.trigger("click"); // file_fieldをクリックさせる。
  });
  /////////画像の投稿ボタン（グレーのブロック）をクリックした時ここまで/////////

  /////////////////////////////////////////////
  /////////画像の削除ボタンをクリックした時/////////
  ////////////////////////////////////////////
  $("#selected-item-images").on("click", ".item-image__buttons--delete", function (e) {
    e.stopPropagation(); // 親要素のイベントが発火するのを防ぐ。
    let image_wrapper = $(this).parents(".item-image"); // 削除する画像の大枠を取得する。
    let index = image_wrapper[0].dataset.index; //何番目の画像を削除するか選択する。
    image_wrapper.remove() // プレビュー画像を削除する。
    $(`#item_item_images_attributes_${index}__destroy`).prop("checked", true); //削除予定か否かのチェックをいれておく。
    /////////ドラッグアンドドロップ///////////
    file_list = file_list.filter(function (file) {
      return file.index != index;
    });
    /////////ドラッグアンドドロップ///////////
    $(`#file_field_index_${index}`).remove();

  });
  /////////画像の削除ボタンをクリックした時ここまで/////////

  /////////////////////////////////////////////
  /////////画像の編集ボタンをクリックした時/////////
  ////////////////////////////////////////////
  $("#selected-item-images").on("click", ".item-image__buttons--edit", function (e) { // 画像の編集ボタンをクリックした時。
    e.stopPropagation(); // 親要素のイベントが発火するのを防ぐ。
    let index = $(this).parents(".item-image")[0].dataset.index; //何番目の画像を変更するか選択する。
    $("#change-item-image")[0].dataset.index = index; //画像変更用ののdata-indexを更新しておく。
    // ↑これは、$(`#image-file-fields`).on("change")が発火した際にどの画像を変更しようとしていたのか判定するため。
    $("#change-item-image").trigger("click"); // 画像変更用のfile_fieldをクリックさせる。
  });
  /////////画像の編集ボタンをクリックした時ここまで/////////

  /////////////////////////////////////////////
  /////////file_fieldが変化した時/////////
  ////////////////////////////////////////////
  $(`#image-file-fields`).on("change", `input[type="file"]`, function (e) { //新しく画像が選択された、もしくは変更しようとしたが何も選択しなかった時
    if ($(this).attr("id") != "change-item-image") { // 画像変更ではない場合
      selectedImage(e.target.files, "button_click");
      return false;
    };
    // 画像を変更した場合
    let file = e.target.files[0];
    let index = $(this)[0].dataset.index //何番目の画像か
    let blob = window.URL.createObjectURL(file); //選択された画像をblob形式に変換する。
    //↑このblobをsrc属性値として使ったimgタグを表示することで、投稿画像のプレビュー機能になる。
    let image = $(`.item-image[data-index=${index}]`).children("img"); // 変更するプレビュー画像を取得する。
    image.attr('src', blob); // プレビュー画像のsrc属性を変更する。
    $(`#file_field_index_${index}`).after(this); //画像変更用のfile_fieldを変更前のfile_fieldの後ろへ移動する。
    $(`#file_field_index_${index}`).remove(); //変更前のfile_fieldを削除する。
    //画像変更用のfile_fieldのid,name,classを変更前のfile_fieldと同じようにする。↓ここからーーー
    $(this).attr("id", `id="file_field_index_${index}"`);
    $(this).attr("name", `item[item_images_attributes][${index}][image]`);
    $(this).attr("class", `new-item-image`);
    //画像変更用のfile_fieldのid,name,classを変更前のfile_fieldと同じようにする。↑ここまでーーー
    $(`#item_item_images_attributes_${index}__destroy`).prop("checked", false); //削除予定か否かのチェックを外しておく。
    newChangeItemImageField(); // 新しく画像変更用のfile_fieldを組み立ててappendする。
    /////////ドラッグアンドドロップ///////////
    $(this)[0].dataset.type = "selected";
    ////↓file_listに入れてあるFileオブジェクトを変更する↓////
    let array_index = file_list.findIndex(function (file) {
      return file.index == index;
    })
    file_list[array_index].data = file;
    ////↑file_listに入れてあるFileオブジェクトを変更する↑////
    $(this).attr("name", "");
    return false;
    /////////ドラッグアンドドロップ///////////
  });
  /////////file_fieldが変化した時ここまで/////////

  /////////////////////////////////////////////
  /////////出品ボタンをクリックした時/////////
  ////////////////////////////////////////////
  $(`input[type="submit"]`).on("click", function (e) { // formをsubmitではなく、送信ボタンをclickにしておく
    e.preventDefault();

    let url = "/api" + form.attr("action");
    let formData = new FormData(form[0]);
    // file_listに保管されている画像をFormDataオブジェクトに追加していく
    file_list.forEach(function (file) {
      formData.append(file.name, file.data);
    });
    $.ajax({
        url: url,
        type: 'POST',
        data: formData,
        dataType: 'json',
        processData: false,
        contentType: false
      })
      .done(function (item) {
        if (item.error_messages) { // item.error_messagesがある場合、何かしらエラーが発生している
          // バリデーションエラーメッセージを表示していく
          $(`.error-field`).text(""); // バリデーションエラーメッセージをリセット
          Object.keys(item.error_messages).forEach(function (key) {
            // メッセージは2件以上入っている場合があるが先頭の1つだけを表示
            $(`.error-field[data-column-name="${key}"]`).text(item.error_messages[key][0]);
          });
          // アラートを表示して中断
          alert("商品出品に失敗しました");
          return false;
        }
        $("form").append(`<input type="hidden" value="true" name="completed">`)
        $("form").submit();
      })
      .fail(function () {
        alert("商品出品に失敗しました");
      })
      .always(function () {
        $(".button").prop('disabled', false);
      })

  })
  /////////出品ボタンを押した時ここまで/////////

  /////ドラッグアンドドロップ用イベントここから/////

  let drag_and_drop_field = $("#select-image-button"); // ドロップ先の要素

  drag_and_drop_field.on('drop', function (e) {
    e.stopPropagation();
    e.preventDefault();
    let files = e.originalEvent.dataTransfer.files;
    selectedImage(files, "dropped");
  })

  drag_and_drop_field.on('dragover', function (e) {
    e.stopPropagation();
    e.preventDefault();
  });
  /////ドラッグアンドドロップ用イベントここまで/////

});
