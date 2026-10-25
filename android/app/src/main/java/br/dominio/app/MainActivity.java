package br.dominio.app;

import android.app.Activity;
import android.content.ContentValues;
import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Environment;
import android.provider.MediaStore;
import android.webkit.JavascriptInterface;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import java.io.File;
import java.io.FileOutputStream;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;

/** O Domínio inteiro dentro do app: um WebView abre o curso servido do próprio aparelho, sem internet. */
public class MainActivity extends Activity {
    private static final int PORTA = 8765;
    private static final int ESCOLHER_ARQUIVO = 7;
    private Servidor servidor;
    private WebView web;
    private String base;
    private ValueCallback<Uri[]> escolha;

    @Override
    protected void onCreate(Bundle salvo) {
        super.onCreate(salvo);
        servidor = new Servidor(getAssets());
        int porta;
        try {
            porta = servidor.iniciar(PORTA);
        } catch (Exception e) {
            porta = PORTA;
        }
        base = "http://127.0.0.1:" + porta + "/";

        web = new WebView(this);
        web.setBackgroundColor(0xFF0D1017);
        setContentView(web);
        WebSettings s = web.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);
        s.setDatabaseEnabled(true);
        s.setAllowFileAccess(false);
        s.setMediaPlaybackRequiresUserGesture(false);
        s.setCacheMode(WebSettings.LOAD_NO_CACHE);
        web.addJavascriptInterface(new Ponte(), "DominioAndroid");

        web.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest req) {
                String url = req.getUrl().toString();
                if (url.startsWith(base)) return false;
                // links das fontes e referências abrem no navegador do celular (precisam de internet)
                try { startActivity(new Intent(Intent.ACTION_VIEW, req.getUrl())); } catch (Exception e) { /* sem navegador */ }
                return true;
            }
        });
        web.setWebChromeClient(new WebChromeClient() {
            @Override
            public boolean onShowFileChooser(WebView v, ValueCallback<Uri[]> cb, FileChooserParams p) {
                if (escolha != null) escolha.onReceiveValue(null);
                escolha = cb;
                Intent i = new Intent(Intent.ACTION_GET_CONTENT);
                i.addCategory(Intent.CATEGORY_OPENABLE);
                i.setType("*/*");
                try {
                    startActivityForResult(Intent.createChooser(i, "Escolha o arquivo do trajeto"), ESCOLHER_ARQUIVO);
                } catch (Exception e) {
                    escolha = null;
                    return false;
                }
                return true;
            }
        });
        if (salvo != null) web.restoreState(salvo);
        else web.loadUrl(base + "index.html");
    }

    @Override
    protected void onActivityResult(int pedido, int resultado, Intent dados) {
        if (pedido == ESCOLHER_ARQUIVO && escolha != null) {
            Uri[] r = null;
            if (resultado == RESULT_OK && dados != null && dados.getData() != null) r = new Uri[]{dados.getData()};
            escolha.onReceiveValue(r);
            escolha = null;
            return;
        }
        super.onActivityResult(pedido, resultado, dados);
    }

    @Override
    protected void onSaveInstanceState(Bundle estado) {
        super.onSaveInstanceState(estado);
        web.saveState(estado);
    }

    @Override
    public void onBackPressed() {
        if (web.canGoBack()) web.goBack();
        else super.onBackPressed();
    }

    @Override
    protected void onDestroy() {
        if (servidor != null) servidor.parar();
        super.onDestroy();
    }

    /** Salvar meu trajeto e o backup do Centro de Dados: o arquivo vai para a pasta Downloads. */
    class Ponte {
        @JavascriptInterface
        public String salvar(String nome, String texto) {
            String limpo = nome.replaceAll("[^A-Za-z0-9._-]", "-");
            byte[] bytes = texto.getBytes(StandardCharsets.UTF_8);
            try {
                if (Build.VERSION.SDK_INT >= 29) {
                    ContentValues v = new ContentValues();
                    v.put(MediaStore.Downloads.DISPLAY_NAME, limpo);
                    v.put(MediaStore.Downloads.MIME_TYPE, limpo.endsWith(".json") ? "application/json" : "text/plain");
                    v.put(MediaStore.Downloads.IS_PENDING, 1);
                    Uri uri = getContentResolver().insert(MediaStore.Downloads.EXTERNAL_CONTENT_URI, v);
                    if (uri == null) return "";
                    try (OutputStream o = getContentResolver().openOutputStream(uri)) { o.write(bytes); }
                    v.clear();
                    v.put(MediaStore.Downloads.IS_PENDING, 0);
                    getContentResolver().update(uri, v, null, null);
                    return "Downloads/" + limpo;
                } else {
                    File pasta = getExternalFilesDir(Environment.DIRECTORY_DOWNLOADS);
                    File f = new File(pasta, limpo);
                    try (FileOutputStream o = new FileOutputStream(f)) { o.write(bytes); }
                    return f.getAbsolutePath();
                }
            } catch (Exception e) {
                return "";
            }
        }
    }
}
