document.addEventListener("DOMContentLoaded", () => {
  /* 初始化昼夜模式 */
  {
    if (localStorage.getItem("data-night")) {
      $(".joe_action_item.mode .icon-1").addClass("active");
      $(".joe_action_item.mode .icon-2").removeClass("active");
    } else {
      $("html").removeAttr("data-night");
      $(".joe_action_item.mode .icon-1").removeClass("active");
      $(".joe_action_item.mode .icon-2").addClass("active");
    }
    $(".joe_action_item.mode").on("click", () => {
      if (localStorage.getItem("data-night")) {
        $(".joe_action_item.mode .icon-1").removeClass("active");
        $(".joe_action_item.mode .icon-2").addClass("active");
        $("html").removeAttr("data-night");
        localStorage.removeItem("data-night");
      } else {
        $(".joe_action_item.mode .icon-1").addClass("active");
        $(".joe_action_item.mode .icon-2").removeClass("active");
        $("html").attr("data-night", "night");
        localStorage.setItem("data-night", "night");
      }
    });
  }

  /* 动态背景 */
  {
    if (!Joe.IS_MOBILE && Joe.DYNAMIC_BACKGROUND !== "off" && Joe.DYNAMIC_BACKGROUND && !Joe.WALLPAPER_BACKGROUND_PC) {
      $.getScript(window.Joe.THEME_URL + `assets/backdrop/${Joe.DYNAMIC_BACKGROUND}`);
    }
  }

  /* 搜索框弹窗 */
  {
    $(".joe_header__above-search .input").on("click", (e) => {
      e.stopPropagation();
      $(".joe_header__above-search .result").addClass("active");
    });
    $(document).on("click", function () {
      $(".joe_header__above-search .result").removeClass("active");
    });
  }

  /* 激活全局下拉框功能 */
  {
    $(".joe_dropdown").each(function (index, item) {
      const menu = $(this).find(".joe_dropdown__menu");
      const trigger = $(item).attr("trigger") || "click";
      const placement = $(item).attr("placement") || $(this).height() || 0;
      menu.css("top", placement);
      if (trigger === "hover") {
        $(this).hover(
          () => $(this).addClass("active"),
          () => $(this).removeClass("active")
        );
      } else {
        $(this).on("click", function (e) {
          $(this).toggleClass("active");
          $(document).one("click", () => $(this).removeClass("active"));
          e.stopPropagation();
        });
        menu.on("click", (e) => e.stopPropagation());
      }
    });
  }

  /* 激活全局返回顶部功能 */
  {
    let _debounce = null;
    const handleScroll = () => ((document.documentElement.scrollTop || document.body.scrollTop) > 300 ? $(".joe_action_item.scroll").addClass("active") : $(".joe_action_item.scroll").removeClass("active"));
    handleScroll();
    $(document).on("scroll", () => {
      clearTimeout(_debounce);
      _debounce = setTimeout(handleScroll, 80);
    });
    $(".joe_action_item.scroll").on("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  }

  /* 激活侧边栏人生倒计时功能 */
  {
    if ($(".joe_aside__item.timelife").length) {
      let timelife = [
        { title: "今日已經過去", endTitle: "小時", num: 0, percent: "0%" },
        { title: "這周已經過去", endTitle: "天", num: 0, percent: "0%" },
        { title: "本月已經過去", endTitle: "天", num: 0, percent: "0%" },
        { title: "今年已經過去", endTitle: "個月", num: 0, percent: "0%" },
      ];
      {
        let nowDate = +new Date();
        let todayStartDate = new Date(new Date().toLocaleDateString()).getTime();
        let todayPassHours = (nowDate - todayStartDate) / 1000 / 60 / 60;
        let todayPassHoursPercent = (todayPassHours / 24) * 100;
        timelife[0].num = parseInt(todayPassHours);
        timelife[0].percent = parseInt(todayPassHoursPercent) + "%";
      }
      {
        let weeks = { 0: 7, 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6 };
        let weekDay = weeks[new Date().getDay()];
        let weekDayPassPercent = (weekDay / 7) * 100;
        timelife[1].num = parseInt(weekDay);
        timelife[1].percent = parseInt(weekDayPassPercent) + "%";
      }
      {
        let year = new Date().getFullYear();
        let date = new Date().getDate();
        let month = new Date().getMonth() + 1;
        let monthAll = new Date(year, month, 0).getDate();
        let monthPassPercent = (date / monthAll) * 100;
        timelife[2].num = date;
        timelife[2].percent = parseInt(monthPassPercent) + "%";
      }
      {
        let month = new Date().getMonth() + 1;
        let yearPass = (month / 12) * 100;
        timelife[3].num = month;
        timelife[3].percent = parseInt(yearPass) + "%";
      }
      let htmlStr = "";
      timelife.forEach((item, index) => {
        htmlStr += `
						<div class="item">
							<div class="title">
								${item.title}
								<span class="text">${item.num}</span>
								${item.endTitle}
							</div>
							<div class="progress">
								<div class="progress-bar">
									<div class="progress-bar-inner progress-bar-inner-${index}" style="width: ${item.percent}"></div>
								</div>
								<div class="progress-percentage">${item.percent}</div>
							</div>
						</div>`;
      });
      $(".joe_aside__item.timelife .joe_aside__item-contain").html(htmlStr);
    }
  }

  /* 激活侧边栏天气功能 */
  {
    if ($(".joe_aside__item.weather").length) {
      const key = $(".joe_aside__item.weather").attr("data-key");
      const style = $(".joe_aside__item.weather").attr("data-style");
      const aqiColor = { 1: "FFFFFF", 2: "4A4A4A", 3: "FFFFFF" };
      window.WIDGET = { CONFIG: { layout: 2, width: "220", height: "270", background: style, dataColor: aqiColor[style], language: "zh", key } };
      $.getScript("https://widget.qweather.net/standard/static/js/he-standard-common.js?v=2.0");
    }
  }

  /* 3d云标签 */
  {
    if ($(".joe_aside__item.tags").length) {
      const entries = [];
      const colors = [
        "#F8D800",
        "#0396FF",
        "#EA5455",
        "#7367F0",
        "#32CCBC",
        "#F6416C",
        "#28C76F",
        "#9F44D3",
        "#F55555",
        "#736EFE",
        "#E96D71",
        "#DE4313",
        "#D939CD",
        "#4C83FF",
        "#F072B6",
        "#C346C2",
        "#5961F9",
        "#FD6585",
        "#465EFB",
        "#FFC600",
        "#FA742B",
        "#5151E5",
        "#BB4E75",
        "#FF52E5",
        "#49C628",
        "#00EAFF",
        "#F067B4",
        "#F067B4",
        "#ff9a9e",
        "#00f2fe",
        "#4facfe",
        "#f093fb",
        "#6fa3ef",
        "#bc99c4",
        "#46c47c",
        "#f9bb3c",
        "#e8583d",
        "#f68e5f",
      ];
      const random = (min, max) => {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
      };
      $(".joe_aside__item-contain .list li").each((i, item) => {
        entries.push({
          label: $(item).attr("data-label"),
          url: $(item).attr("data-url"),
          target: "_blank",
          fontColor: colors[random(0, colors.length - 1)],
          fontSize: 15,
        });
      });
      $(".joe_aside__item-contain .tag").svg3DTagCloud({
        entries,
        width: 220,
        height: 220,
        radius: "65%",
        radiusMin: 75,
        bgDraw: false,
        fov: 800,
        speed: 0.5,
        fontWeight: 500,
      });
    }
  }

  /* 侧边栏舔狗日记 */
  {
    if ($(".joe_aside__item.flatterer").length) {
      const arr = [
        "你昨天晚上又沒回我信息，我卻看見你的遊戲在線，在我再一次孜孜不倦的騷擾你的情況下，你終於跟我說了一句最長的話「**你他媽是不是有病**」，我又陷入了沈思，這一定有什麽含義，我想了很久，你竟然提到了我的媽媽，原來你已經想得那麽長遠了，想和我結婚見我的父母，我太感動了，真的。那你現在在幹嘛，我好想你，我媽媽說她也很喜歡你。",
        "今天我觀戰了一天你和別人打遊戲，**你們玩的很開心**；我給你發了200多條消息，你說沒流量就不回；晚上發說說沒有人愛你，我連滾帶爬評論了句有「我在」，你把我拉黑了，我給你打電話也無人接聽。對不起，我不該打擾你，我求求你再給我一次當好友的機會吧！",
        "我爸說再敢網戀就打斷我的腿，幸好不是胳膊，這樣我還能繼續**和你打字聊天**，就算連胳膊也打斷了，我的心裏也會有你位置。",
        "你說你情侶頭像是一個人用的，空間上鎖是因為你不喜歡玩空間，情侶空間是和閨蜜開的，找你連麥時你說你在忙工作，每次聊天你都說在忙，你真是一個**上進的好女孩**，你真好，我好喜歡你！",
        "你跟他已經醒了吧？我今天撿垃圾掙了一百多，明天給你打過去。你快點休息吧，我明天叫你起床，給你點外賣買煙，給你點你最喜歡的奶茶。晚上我會繼續去擺地攤的，你不用擔心我，你床只有那麽大睡不下三個。**你要好好照顧好自己，不要讓他搶你被子**。我永遠愛你！",
        "她三天沒回我的消息了，在我孜孜不倦地騷擾下她終於舍得回我「**nmsl**」，我想這一定是有什麽含義吧，噢！我恍然大悟原來是**尼美舒利顆粒**，她知道我有關節炎讓我吃尼美舒利顆粒，她還是關心我的，但是又不想顯現的那麽熱情。天啊！她好高冷，我好像更喜歡她了！",
        "你想我了吧？可以回我消息了嗎？我買了萬通筋骨貼，你**運動一個晚上腰很疼**吧？今晚早點回家，我燉了排骨湯，我永遠在家等你。",
        "昨晚你和朋友打了一晚上遊戲，你破天荒的給我看了戰績，雖然我看不懂但是我相信你一定是最厲害的、最棒的。我給你發了好多消息誇你，告訴你我多崇拜你，你回了我一句「**啥B**」，我翻來覆去思考這是什麽意思，Sha[傻]，噢你是說我傻，那B就是Baby的意思了吧，原來你是在叫我**傻寶**，這麽寵溺的語氣，我竟一時不敢相信，其實你也是喜歡我的對吧。",
        "今天我還是照常給你發消息，匯報日常工作，你終於回了我四個字：「**嗯嗯，好的。**」。你開始願意敷衍我了，我太感動了，受寵若驚。我願意天天給你發消息，就算你天天罵我，我也不覺得煩。",
        "你昨天晚上又沒回我的消息，在我孜孜不倦的騷擾下，你終於舍得回我了，你說「**滾**」，這其中一定有什麽含義，我想了很久，滾是三點水，這代表你對我的思念也如**滾滾流水**一樣洶湧，我感動哭了，不知道你現在在幹嘛，我很想你。",
        "聽說你想要一套化妝品，我算了算，明天我去工地上**搬一天磚**，就可以拿到200塊錢，再加上我上個月攢下來的零花錢，剛好給你買一套迪奧。",
        "今天表白被拒絕了，她對我說能不能脫下褲子**撒泡尿照照自己**。當我脫下褲子，她咽了口水，說我們可以試一下。",
        "剛從派出所出來，原因前幾天14號情人節，我想送你禮物，我去偷東西的時候被抓了。我本來想反抗，警察說了一句老實點別動，我立刻就放棄了反抗，因為我記得你說過，你喜歡**老實人**。",
        "疫情不能出門，現在是早上八點，你肯定餓了吧。我早起做好了早餐來到你小區，保安大哥不讓進。我給你打了三個電話你終於接了「**有病啊，我還睡覺呢，你小區門口等著吧**」。啊，我高興壞了！你終於願意吃我做的早餐了，還讓我等你，啊！啊！啊！好幸福噢！",
        "我存了兩個月錢，給你買了一雙**北卡藍**，你對我說一句「謝謝」，我好開心。這是你第一次對我說兩個字，以前你都只對我說滾。今天晚上逛**閑魚**，看到了你把我送你的北卡藍發布上去了。我想你一定是在考驗我，再次送給你，給你一個驚喜，我愛你。",
        "昨天**你領完紅包就把我刪了**，我陷入久久地沈思。我想這其中一定有什麽含義，原來你是在欲擒故縱，嫌我不夠愛你。無理取鬧的你變得更加可愛了，我會堅守我對你的愛的。你放心好啦！今天發工資了，發了1850，給你微信轉了520，支付寶1314，還剩下16。給你發了很多消息你沒回。剩下16塊我在小賣部買了你愛吃的老壇酸菜牛肉面，給你寄過去了。希望你保護好食欲，我去上班了愛你~~",
        "在保安亭內看完了最新一集的梨泰院，曾經多麽倔強的樸世路因為伊瑞給張大熙跪下了，亭外的樹也許感受到了**我的悲傷**，枯了。我連樹都保護不了，怎麽保護你，或許保安才是真的需要被保護的吧。我難受，我想你。over",
        "難以言喻的下午。說不想你是假的，說愛你是真的。昨天他們罵**我是你的舔狗**，我不相信，因為我知道你肯定也是愛我的，你一定是在考驗我對你的感情，只要我堅持下去你一定會被我的真誠所打動，加油！不過我要批評你一下，昨晚你說**去酒店跟人鬥地主**，我尋思兩個人也玩不了呀。算了，不想了，畢竟打牌是賭博行為，不太好。",
        "明天就周六了我知道你不上班，但是我怕你睡懶覺不吃早飯餓壞自己。我早晨4點去菜市場買了新鮮活雞**給你燉雞湯**，阿姨給我用箱子裝了起來，我騎上我280買的電動車哼著小調回家，心想你一定會被我感動的，箱子半路開了，雞跑了，拐到了一個胡同裏，淩晨4點的胡同還有穿超短裙和大叔聊天的美女，不禁感嘆這個世界變了，她問我找什麽，…………。對不起，我愛你",
        "12點隊長過來準時交班，出去的車輛按喇叭我也沒聽到，只因我在監控中看到了穿睡衣出來倒垃圾的你，**望你望的入神**不由的傻笑了起來，隊長過來罵我扣了我一天工資。我委屈，想抱你。你送的泡面真好吃。",
        "今天的我排位輸了好多把，我將這些事情分享給你，但是你一個字都沒有講，我在想你是不是在忙？我頭痛欲裂，終於在我給你發了幾十條消息之後，你回了我一個「**腦子是不是有病？**」，原來你還是關心我的，看到這句話，我的腦子一下就不疼了，今天也是愛你的一天。",
        "我存了半年的工資，給你買了一只LV，你對我說了一句「**你真好**」，我好開心，這是你第一次這麽認可我，以前你都只對我說滾。今天晚上逛閑魚，看到你把我送你的LV發布上去了。我想，你一定是在考驗我，於是我用借唄裏的錢把它買了下來，再次送給你，給你一個驚喜，我愛你。",
        "其實我每月工資6000，但我只給你轉2000，你以為我給你了全部。才不是，我一共舔了3個啦，**我要舔的雨露均沾**，才不會把你當成唯一。",
        "昨天你把我拉黑了，我看著紅色感嘆號陷入了久久的沈思，我想這其中一定有什麽含義？紅色紅色？我明白了！紅色代表熱情，你對我很熱情，你想和我結婚，我願意。",
        "今天你問我借了兩千塊錢，說要做個手術，你果然還是愛我的，**不是我的孩子，你不要**。 ",
        "中午你無故扇了我一巴掌，我握著你的手說「手怎麽這麽涼，都怪我沒有照顧好你，一定要更加對你好」。",
        "我給你打了幾通電話，你終於接了。聽到了**你發出啊啊啊啊的聲音**，你說你肚子痛，我想你一定是很難受吧。電話還有個男的對你說「來換個姿勢」，一定是**在做理療**了。期待你早日康復，我好擔心。",
        "昨天晚上好冷，本來以為街上沒人，結果剛剛**偷電動車**的時候被抓了，本來想反抗，但警察說了一句老實點別動，我立刻就放棄了抵抗，因為我記得你說過，你喜歡**老實人**。",
        "找你連麥時你說你在忙工作，每次聊天你都說在忙，你真是一個**上進的好女孩**，你真好，發現我越來越喜歡這樣優秀的你。",
        "你從來沒說過愛我，聊天記錄搜索了一下「愛」，唯一的一條是：**你好像鄉村愛情裏的劉能啊**。",
        "今天好開心啊，和你一起在峽谷嬉戲，打完一波團戰之後看到你在打大龍，殘血的我跳過去直接被龍爪拍死，但這一刻我覺得好浪漫，**死在你的腳旁邊，這是我離你最近的一次**。",
        "哥們，求你和她說句話吧，這樣她就不會那麽難過了。",
        "今天你把我的微信拉黑了，這下我終於解放了！以前我總擔心太多消息會打擾你，現在我終於不用顧忌，不管我怎麽給你發消息，都不會讓你不開心了。等我**攢夠5201314條**我就拿給你看，你一定會震驚得說不出話然後哭著說會愛我一輩子。哈哈。",
        "昨天你把我刪了，我陷入了久久的沈思 。我想這其中一定有什麽含義，你應該是欲擒故縱吧，嫌我不夠愛你。突然覺得**無理取鬧的你變得更加可愛**了，我會堅守我對你的愛的 你放心好啦！這麽一想，突然對我倆的未來更有期望了呢。",
        "今天上班不是太忙，百無聊賴，又翻出了你的相片，看了又看。今天是我認識你的第302天，也是我愛你的第302天，可是這些你並不知道，也許**你知道了，也不會在意**吧。 此刻的我好想你！ ",
        "今天你跟我說我很醜，讓我不要騷擾你了。我聽了很高興，小說裏的主角都像你這樣，最開始表現的很厭惡，但最後**總會被我的真心打動**。你現在有多討厭我，以後就會有多愛我。嘻嘻。",
        "我坐在窗邊給你發了99條消息，你終於肯回我了，你說「**發你媽啊**」，我一下子就哭了。原來努力真的有用，你已經開始考慮想見我的媽媽了，你也是挺喜歡我的。",
        "剛才我找你說話，你回了一個滾，我陷入了沈思，你還是如此的關心我，知道我腿受傷了，讓我這樣走，好感動！看來你還是愛我的！",
        "今天下雨了，我去你公司接你下班。看見我你不耐煩的說「**煩不煩啊，不要再找我了**」，一頭沖進雨裏就跑開了。我心裏真高興啊，你寧願自己淋雨，都不願讓我也淋濕一點，你果然還是愛我的。",
        "晚上和你聊天，10點鐘不到，你就說「**困了，去睡覺了**」。現在淩晨1點鐘，看到你給他的朋友圈點贊評論，約他明天去吃火鍋，一定是你微信被盜了吧。",
        "今天我主動給你發了遊戲邀請，邀請你和我單挑安琪拉，雖然我安琪拉很菜，可是為了和你打遊戲，我還是毅然決然給你發了邀請。你說你不接受，你在打其他遊戲。聯想到我自己很菜，我突然明白，原來你還是在乎我的，只是不想一遍遍連招一套的在泉水送我走。我再一次感動哭了，因此，我好像更喜歡你了，你可真是一個寶藏男孩！",
        "你的頭像是一個女孩子左手邊牽著一條秋田犬，犬=狗，而**我是一條舔狗**。是不是代表你的小手在牽著我呢？",
        "今天發工資了，我一個月工資3000，你猜我會給你多少，是不是覺得我會給你2500，自己留500吃飯？你想多了，我3000都給你，因為廠裏包吃包住。",
        "昨天就為你充了710點卷，雖然知道你不會玩不知去向，但你說好看，你剛才說小號想要還想要一個，愛你的我還是滿心歡喜的把剩下的100元夥食費又給你充了710，然後看到你小號並沒有買，而是你送給了你的一個弟弟，你對弟弟真好，好有愛心，我感覺對你陷得很深了。",
        "今天我給你發消息，你回復我「**nmsl**」，我想了半天才知道你是在誇我，原來是**你美死了**，你嘴真甜，我愛你。",
        "你說你想買口紅，今天我去了叔叔的口罩廠做了一天的打包。拿到了兩百塊錢，加上我這幾天**省下的錢剛好能給你買一根小金條**。即沒有給我自己剩下一分錢，但你不用擔心，因為廠裏包吃包住。對了打包的時候，滿腦子都是你，想著你哪天突然就接受我的橄欖枝了呢。而且今天我很棒呢，主管表揚我很能幹，其實也有你的功勞啦，是你給了我無窮的力量。今天我比昨天多想你一點，比明天少想你一點。",
        "在我一如既往的每天跟她問早安的時候，她今天終於回我了。我激動地問她我是不是今天第一個跟她說話的人，她說不是，是**她男朋友把她叫起來退房**的。",
        "聽說你朋友說今天出門了，我打扮成精神小夥來找你，沒想到你竟然對我說「**給我爬，別過來**」我當場就哭了，原來真心真的會感動人，你一定是知道，穿豆豆鞋走路腳會很累，讓我爬是因為這樣不會累著腳，其實你是喜歡我的吧",
        "今天把你的備註改成了「**對方正在輸入...**」，這樣我就知道你不是不想回我，剛又給你發了消息，看到你在思考怎麽回我，我就知道你和我一樣，心裏有我。",
        "今天在樓上窗戶上看見你和他在公園裏接吻，我看見哭了出來，並打電話給你，想問問你為什麽？但你說怎麽了，聲音是那麽好聽。於是我說「**以後你和他接吻的時候，能不能用我送給你的口紅啊？**」",
        "我退了無關緊要的群，唯獨這個群我沒有退，因為這裏有一個對我來說很特別的女孩子，我們不是好友，**我每天只能通過群名片看看她**，雖然一張照片也看不到，我也知足了，我不敢說她的名字，但我知道她是群裏面最美的女孩子，她說我們這樣會距離產生美~ 我想想發現她說的挺對的，我心裏很開心。",
        "今天早上我告訴你我想你了，你沒理我。今天中午我給你打電話，你不接，打第二個你就關機。晚上我在你公司樓下等你，你對我說的第一句話就是滾「**滾，別煩我，別浪費時間了**」，我真的好感動，你居然為我考慮了，怕我浪費時間。嗚嗚嗚，這是我愛你的第74天。",
        "我坐在窗邊給你發了99條消息，你終於肯回我了你說「**發你媽啊**」，我一下子就哭了，原來努力真的有用，你已經開始考慮想見我的媽媽了，你其實也是挺喜歡我的。",
        "你一個小時沒回我的消息，在我孜孜不倦地騷擾下你終於舍得回我了「**在做愛**」，這其中一定有什麽含義，我想了很久，「在做愛」這簡簡單單的三個字肯定是三句話，分別是**我在忙、做你女朋友、我愛你**，想到這裏我不禁流下了眼淚，我這麽長時間的喜歡沒有白費，不知道你現在忙幹嘛，但我很想你。",
        "最近我暗戀的女生每天都和不同的男生約會，我想總有一天會輪到我，我問她什麽時候能見見我？她說**下輩子吧**。她真好，下輩子還要和我在一起。",
        "你好像從來沒有對我說過晚安，我在我們的聊天記錄裏搜索了關鍵字：「晚安」，你說過一次：**我早晚安排人弄死你**。",
      ];
      const random = (min, max) => {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
      };
      const toggle = () => {
        $(".joe_aside__item.flatterer .content").html(arr[random(0, arr.length - 1)].replace(/\*\*(.*?)\*\*/g, "<mark>$1</mark>"));
        $(".joe_aside__item.flatterer .content").attr("class", "content type" + random(1, 6));
      };
      toggle();
      $(".joe_aside__item.flatterer .change").on("click", () => toggle());
    }
  }

  /* 评论框点击切换画图模式和文本模式 */
  {
    if ($(".joe_comment").length) {
      $(".joe_comment__respond-type .item").on("click", function () {
        $(this).addClass("active").siblings().removeClass("active");
        if ($(this).attr("data-type") === "draw") {
          $(".joe_comment__respond-form .body .draw").show().siblings().hide();
          $("#joe_comment_draw").prop("width", $(".joe_comment__respond-form .body").width());
          /* 设置表单格式为画图模式 */
          $(".joe_comment__respond-form").attr("data-type", "draw");
        } else {
          $(".joe_comment__respond-form .body .text").show().siblings().hide();
          /* 设置表单格式为文字模式 */
          $(".joe_comment__respond-form").attr("data-type", "text");
        }
      });
    }
  }

  /* 激活画图功能 */
  {
    if ($("#joe_comment_draw").length) {
      /* 激活画板 */
      window.sketchpad = new Sketchpad({ element: "#joe_comment_draw", height: 300, penSize: 5, color: "303133" });
      /* 撤销上一步 */
      $(".joe_comment__respond-form .body .draw .icon-undo").on("click", () => window.sketchpad.undo());
      /* 动画预览 */
      $(".joe_comment__respond-form .body .draw .icon-animate").on("click", () => window.sketchpad.animate(10));
      /* 更改画板的线宽 */
      $(".joe_comment__respond-form .body .draw .line li").on("click", function () {
        window.sketchpad.penSize = $(this).attr("data-line");
        $(this).addClass("active").siblings().removeClass("active");
      });
      /* 更改画板的颜色 */
      $(".joe_comment__respond-form .body .draw .color li").on("click", function () {
        window.sketchpad.color = $(this).attr("data-color");
        $(this).addClass("active").siblings().removeClass("active");
      });
    }
  }

  /* 重写评论功能 */
  {
    if ($(".joe_comment__respond").length) {
      const respond = $(".joe_comment__respond");
      /* 重写回复功能 */
      $(".joe_comment__reply").on("click", function () {
        /* 父级ID */
        const coid = $(this).attr("data-coid");
        /* 当前的项 */
        const item = $("#" + $(this).attr("data-id"));
        /* 添加自定义属性表示父级ID */
        respond.find(".joe_comment__respond-form").attr("data-coid", coid);
        item.append(respond);
        $(".joe_comment__respond-type .item[data-type='text']").click();
        $(".joe_comment__cancle").show();
        window.scrollTo({
          top: item.offset().top - $(".joe_header").height() - 15,
          behavior: "smooth",
        });
      });
      /* 重写取消回复功能 */
      $(".joe_comment__cancle").on("click", function () {
        /* 移除自定义属性父级ID */
        respond.find(".joe_comment__respond-form").removeAttr("data-coid");
        $(".joe_comment__cancle").hide();
        $(".joe_comment__title").after(respond);
        $(".joe_comment__respond-type .item[data-type='text']").click();
        window.scrollTo({
          top: $(".joe_comment").offset().top - $(".joe_header").height() - 15,
          behavior: "smooth",
        });
      });
    }
  }

  /* 激活评论提交 */
  {
    if ($(".joe_comment").length) {
      let isSubmit = false;
      $(".joe_comment__respond-form").on("submit", function (e) {
        e.preventDefault();
        const action = $(".joe_comment__respond-form").attr("action") + "?time=" + +new Date();
        const type = $(".joe_comment__respond-form").attr("data-type");
        const parent = $(".joe_comment__respond-form").attr("data-coid");
        const author = $(".joe_comment__respond-form .head input[name='author']").val();
        const _ = $(".joe_comment__respond-form input[name='_']").val();
        const mail = $(".joe_comment__respond-form .head input[name='mail']").val();
        const url = $(".joe_comment__respond-form .head input[name='url']").val();
        let text = $(".joe_comment__respond-form .body textarea[name='text']").val();
        if (author.trim() === "") return Qmsg.info("請輸入昵稱！");
        if (!/\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/.test(mail)) return Qmsg.info("請輸入正確的郵箱！");
        if (type === "text" && text.trim() === "") return Qmsg.info("請輸入評論內容！");
        if (type === "draw") {
          const txt = $("#joe_comment_draw")[0].toDataURL("image/webp", 0.1);
          text = "{!{" + txt + "}!} ";
        }
        if (isSubmit) return;
        isSubmit = true;
        $(".joe_comment__respond-form .foot .submit button").html("發送中...");
        $.ajax({
          url: action,
          type: "POST",
          data: { author, mail, text, parent, url, _ },
          dataType: "text",
          success(res) {
            let arr = [],
              str = "";
            arr = $(res).contents();
            Array.from(arr).forEach((_) => {
              if (_.parentNode.className === "container") str = _;
            });
            if (!/Joe/.test(res)) {
              Qmsg.warning(str.textContent.trim() || "");
              isSubmit = false;
              $(".joe_comment__respond-form .foot .submit button").html("發表評論");
            } else {
              window.location.reload();
            }
          },
          error() {
            isSubmit = false;
            $(".joe_comment__respond-form .foot .submit button").html("發表評論");
            Qmsg.warning("發送失敗！請刷新重試！");
          },
        });
      });
    }
  }

  /* 设置评论回复网址为新窗口打开 */
  {
    $(".comment-list__item .term .content .user .author a").each((index, item) => $(item).attr("target", "_blank"));
  }

  /* 格式化评论分页的hash值 */
  {
    $(".joe_comment .joe_pagination a").each((index, item) => {
      const href = $(item).attr("href");
      if (href && href.includes("#")) {
        $(item).attr("href", href.replace("#comments", "?scroll=joe_comment"));
      }
    });
  }

  /* 切换标签显示不同的标题 */
  {
    if (Joe.DOCUMENT_TITLE) {
      const TITLE = document.title;
      document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "hidden") {
          document.title = Joe.DOCUMENT_TITLE;
        } else {
          document.title = TITLE;
        }
      });
    }
  }

  /* 小屏幕伸缩侧边栏 */
  {
    $(".joe_header__above-slideicon").on("click", function () {
      /* 关闭搜索框 */
      $(".joe_header__searchout").removeClass("active");
      /* 处理开启关闭状态 */
      if ($(".joe_header__slideout").hasClass("active")) {
        $("body").css("overflow", "");
        $(".joe_header__mask").removeClass("active slideout");
        $(".joe_header__slideout").removeClass("active");
      } else {
        $("body").css("overflow", "hidden");
        $(".joe_header__mask").addClass("active slideout");
        $(".joe_header__slideout").addClass("active");
      }
    });
  }

  /* 小屏幕搜索框 */
  {
    $(".joe_header__above-searchicon").on("click", function () {
      /* 关闭侧边栏 */
      $(".joe_header__slideout").removeClass("active");
      /* 处理开启关闭状态 */
      if ($(".joe_header__searchout").hasClass("active")) {
        $("body").css("overflow", "");
        $(".joe_header__mask").removeClass("active slideout");
        $(".joe_header__searchout").removeClass("active");
      } else {
        $("body").css("overflow", "hidden");
        $(".joe_header__mask").addClass("active");
        $(".joe_header__searchout").addClass("active");
      }
    });
  }

  /* 点击遮罩层关闭 */
  {
    $(".joe_header__mask").on("click", function () {
      $("body").css("overflow", "");
      $(".joe_header__mask").removeClass("active slideout");
      $(".joe_header__searchout").removeClass("active");
      $(".joe_header__slideout").removeClass("active");
    });
  }

  /* 移动端侧边栏菜单手风琴 */
  {
    $(".joe_header__slideout-menu .current").parents(".panel-body").show().siblings(".panel").addClass("in");
    $(".joe_header__slideout-menu .panel").on("click", function () {
      const panelBox = $(this).parent().parent();
      /* 清除全部内容 */
      panelBox.find(".panel").not($(this)).removeClass("in");
      panelBox.find(".panel-body").not($(this).siblings(".panel-body")).stop().hide("fast");
      /* 激活当前的内容 */
      $(this).toggleClass("in").siblings(".panel-body").stop().toggle("fast");
    });
  }

  /* 初始化网站运行时间 */
  {
    const getRunTime = () => {
      const birthDay = new Date(Joe.BIRTHDAY);
      const today = +new Date();
      const timePast = today - birthDay.getTime();
      let day = timePast / (1000 * 24 * 60 * 60);
      let dayPast = Math.floor(day);
      let hour = (day - dayPast) * 24;
      let hourPast = Math.floor(hour);
      let minute = (hour - hourPast) * 60;
      let minutePast = Math.floor(minute);
      let second = (minute - minutePast) * 60;
      let secondPast = Math.floor(second);
      day = String(dayPast).padStart(2, 0);
      hour = String(hourPast).padStart(2, 0);
      minute = String(minutePast).padStart(2, 0);
      second = String(secondPast).padStart(2, 0);
      $(".joe_run__day").html(day);
      $(".joe_run__hour").html(hour);
      $(".joe_run__minute").html(minute);
      $(".joe_run__second").html(second);
    };
    if (Joe.BIRTHDAY && /(\d{4})\/(\d{1,2})\/(\d{1,2}) (\d{1,2})\:(\d{1,2})\:(\d{1,2})/.test(Joe.BIRTHDAY)) {
      getRunTime();
      setInterval(getRunTime, 1000);
    }
  }

  /* 初始化表情功能 */
  {
    if ($(".joe_owo__contain").length && $(".joe_owo__target").length) {
      $.ajax({
        url: window.Joe.THEME_URL + "assets/json/joe.owo.json",
        dataType: "json",
        success(res) {
          let barStr = "";
          let scrollStr = "";
          for (let key in res) {
            const item = res[key];
            barStr += `<div class="item" data-type="${key}">${key}</div>`;
            scrollStr += `
                            <ul class="scroll" data-type="${key}">
								${item.map((_) => `<li class="item" data-text="${_.data}">${key === "顏文字" ? `${_.icon}` : `<img src="${window.Joe.THEME_URL + _.icon}" alt="${_.data}"/>`}</li>`).join("")}
                            </ul>
                        `;
          }
          $(".joe_owo__contain").html(`
                        <div class="seat">OωO</div>
                        <div class="box">
                            ${scrollStr}
                            <div class="bar">${barStr}</div>
                        </div>
                    `);
          $(document).on("click", function () {
            $(".joe_owo__contain .box").stop().slideUp("fast");
          });
          $(".joe_owo__contain .seat").on("click", function (e) {
            e.stopPropagation();
            $(this).siblings(".box").stop().slideToggle("fast");
          });
          $(".joe_owo__contain .box .bar .item").on("click", function (e) {
            e.stopPropagation();
            $(this).addClass("active").siblings().removeClass("active");
            const scrollIndx = '.joe_owo__contain .box .scroll[data-type="' + $(this).attr("data-type") + '"]';
            $(scrollIndx).show().siblings(".scroll").hide();
          });
          $(".joe_owo__contain .scroll .item").on("click", function () {
            const text = $(this).attr("data-text");
            $(".joe_owo__target").insertContent(text);
          });
          $(".joe_owo__contain .box .bar .item").first().click();
        },
      });
    }
  }

  /* 座右铭 */
  {
    let motto = Joe.MOTTO;
    if (!motto) motto = "有錢終成眷屬，沒錢親眼目睹";
    if (motto.includes("http")) {
      $.ajax({
        url: motto,
        dataType: "text",
        success: (res) => $(".joe_motto").html(res),
      });
    } else {
      $(".joe_motto").html(motto);
    }
  }

  /* 头部滚动 */
  {
    if (!window.Joe.IS_MOBILE) {
      let flag = true;
      const handleHeader = (diffY) => {
        if (window.pageYOffset >= $(".joe_header").height() && diffY <= 0) {
          if (flag) return;
          $(".joe_header").addClass("active");
          $(".joe_aside .joe_aside__item:last-child").css("top", $(".joe_header").height() - 60 + 15);
          flag = true;
        } else {
          if (!flag) return;
          $(".joe_header").removeClass("active");
          $(".joe_aside .joe_aside__item:last-child").css("top", $(".joe_header").height() + 15);
          flag = false;
        }
      };
      let Y = window.pageYOffset;
      handleHeader(Y);
      let _last = Date.now();
      document.addEventListener("scroll", () => {
        let _now = Date.now();
        if (_now - _last > 15) {
          handleHeader(Y - window.pageYOffset);
          Y = window.pageYOffset;
        }
        _last = _now;
      });
    }
  }
});
