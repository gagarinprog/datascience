package br.dominio.app;

import android.content.res.AssetManager;

import java.io.ByteArrayOutputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.InetAddress;
import java.net.ServerSocket;
import java.net.Socket;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

/** Servidor HTTP mínimo, só no próprio aparelho (127.0.0.1), que entrega os arquivos do curso guardados no app. */
public class Servidor {
    private static final Map<String, String> TIPOS = new HashMap<>();
    static {
        TIPOS.put("html", "text/html; charset=utf-8");
        TIPOS.put("js", "text/javascript; charset=utf-8");
        TIPOS.put("mjs", "text/javascript; charset=utf-8");
        TIPOS.put("css", "text/css; charset=utf-8");
        TIPOS.put("json", "application/json");
        TIPOS.put("webmanifest", "application/manifest+json");
        TIPOS.put("wasm", "application/wasm");
        TIPOS.put("png", "image/png");
        TIPOS.put("svg", "image/svg+xml");
        TIPOS.put("woff2", "font/woff2");
        TIPOS.put("whl", "application/octet-stream");
        TIPOS.put("zip", "application/zip");
        TIPOS.put("data", "application/octet-stream");
        TIPOS.put("sql", "text/plain; charset=utf-8");
        TIPOS.put("py", "text/plain; charset=utf-8");
        TIPOS.put("txt", "text/plain; charset=utf-8");
    }

    private final AssetManager assets;
    private final ExecutorService fila = Executors.newFixedThreadPool(6);
    private ServerSocket socket;

    public Servidor(AssetManager assets) { this.assets = assets; }

    /** Tenta a porta pedida (o endereço fixo mantém o progresso guardado no navegador) e devolve a porta usada. */
    public int iniciar(int porta) throws IOException {
        try {
            socket = new ServerSocket(porta, 50, InetAddress.getByName("127.0.0.1"));
        } catch (IOException e) {
            socket = new ServerSocket(0, 50, InetAddress.getByName("127.0.0.1"));
        }
        Thread t = new Thread(() -> {
            while (!socket.isClosed()) {
                try {
                    Socket s = socket.accept();
                    fila.execute(() -> atender(s));
                } catch (IOException e) {
                    // fechado
                }
            }
        }, "servidor-dominio");
        t.setDaemon(true);
        t.start();
        return socket.getLocalPort();
    }

    public void parar() {
        try { if (socket != null) socket.close(); } catch (IOException e) { /* nada */ }
        fila.shutdownNow();
    }

    private static String lerLinha(InputStream in) throws IOException {
        StringBuilder sb = new StringBuilder();
        int c;
        while ((c = in.read()) != -1) {
            if (c == '\n') break;
            if (c != '\r') sb.append((char) c);
        }
        return c == -1 && sb.length() == 0 ? null : sb.toString();
    }

    private void atender(Socket s) {
        try (Socket sock = s) {
            sock.setSoTimeout(30000);
            InputStream in = sock.getInputStream();
            OutputStream out = sock.getOutputStream();
            String linha = lerLinha(in);
            if (linha == null) return;
            String cab;
            do { cab = lerLinha(in); } while (cab != null && !cab.isEmpty());
            String[] partes = linha.split(" ");
            if (partes.length < 2) return;
            String metodo = partes[0];
            String caminho = partes[1];
            int q = caminho.indexOf('?');
            if (q >= 0) caminho = caminho.substring(0, q);
            int h = caminho.indexOf('#');
            if (h >= 0) caminho = caminho.substring(0, h);
            caminho = URLDecoder.decode(caminho, "UTF-8");
            if (caminho.endsWith("/")) caminho += "index.html";
            String rel = caminho.startsWith("/") ? caminho.substring(1) : caminho;
            if (rel.contains("..")) { responder(out, 404, "text/plain", new byte[0], true); return; }
            byte[] corpo;
            try (InputStream a = assets.open("www/" + rel)) {
                ByteArrayOutputStream buf = new ByteArrayOutputStream();
                byte[] b = new byte[65536];
                int n;
                while ((n = a.read(b)) > 0) buf.write(b, 0, n);
                corpo = buf.toByteArray();
            } catch (FileNotFoundException e) {
                responder(out, 404, "text/plain", "não encontrado".getBytes(StandardCharsets.UTF_8), true);
                return;
            }
            int ponto = rel.lastIndexOf('.');
            String ext = ponto >= 0 ? rel.substring(ponto + 1).toLowerCase() : "";
            String tipo = TIPOS.containsKey(ext) ? TIPOS.get(ext) : "application/octet-stream";
            responder(out, 200, tipo, corpo, !"HEAD".equals(metodo));
        } catch (IOException e) {
            // conexão encerrada pelo navegador
        }
    }

    private static void responder(OutputStream out, int status, String tipo, byte[] corpo, boolean comCorpo) throws IOException {
        String texto = status == 200 ? "OK" : "Not Found";
        String cab = "HTTP/1.1 " + status + " " + texto + "\r\n"
                + "Content-Type: " + tipo + "\r\n"
                + "Content-Length: " + corpo.length + "\r\n"
                + "Cache-Control: no-cache\r\n"
                + "Cross-Origin-Resource-Policy: same-origin\r\n"
                + "Connection: close\r\n\r\n";
        out.write(cab.getBytes(StandardCharsets.US_ASCII));
        if (comCorpo) out.write(corpo);
        out.flush();
    }
}
