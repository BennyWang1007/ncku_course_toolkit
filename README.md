# Ncku Course Toolkit
## JS script made for tampermonkey, paste it and have fun

* ## 進入設定的按鈕在左上角(會自動隱藏)
    ![進入設定的按鈕在左上角(會自動隱藏)](https://i.ibb.co/R3Xb0N1/setting-button.png)

* ## 設定的視窗
    ![設定的視窗](https://i.ibb.co/bXrvwdS/setting-window.png)

## 顯示設置
* 勾選後畫面左上角將**不會**有設定按鈕，須從tampermonkey腳本設置中重啟

## 隱藏課程 
* 不可用時段 ： 將與下方課表衝突的課程隱藏
* 額滿時段 ： 將已額滿的課程隱藏
* 體育 ： 可分別隱藏男、女、大一、大二、校隊體育

## 課表
* 可自由設定的已選課表，可利用下方取得已選課程自動填入
* 點選日期或是節數可以一次全選/全不選該欄/列

## 按鈕
* 重設 ： 將儲存資料重設並刷新課程
* 儲存 ： 儲存當前設定並刷新課程
* 關閉 ： 關閉當前設定清單但不刷新課程
* 取得已選課程 ： 取得已選課程並刷新課程

## 目標課程
* 請填入目標的**課程代碼**（或部分），如 **`A123400`, `A123400-2`**，若有餘額會自動按下選課按鈕，需再自行輸入驗證碼
* 按鈕 ： 若勾選將會每5秒刷新一次網頁

## TODO Feature
* Add CAPTCHA recognition
* Reordering preference list in schedule page.
* Add teachers & courses evaluation.