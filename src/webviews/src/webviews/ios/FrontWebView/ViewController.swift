import UIKit
import WebKit

final class ViewController: UIViewController, WKScriptMessageHandler, WKNavigationDelegate {
    private var webView: WKWebView!
    private var showingAppOwned404 = false

    override func loadView() {
        let configuration = WKWebViewConfiguration()
        configuration.userContentController.add(self, name: "frontNative")

        webView = WKWebView(frame: .zero, configuration: configuration)
        webView.allowsBackForwardNavigationGestures = true
        webView.scrollView.pinchGestureRecognizer?.isEnabled = false
        webView.navigationDelegate = self
        view = webView
    }

    override func viewDidLoad() {
        super.viewDidLoad()

        let configuredURL = (Bundle.main.object(forInfoDictionaryKey: "FrontURL") as? String ?? "")
            .trimmingCharacters(in: .whitespacesAndNewlines)

        if !configuredURL.isEmpty,
           let remoteURL = URL(string: configuredURL),
           remoteURL.scheme?.lowercased() == "https",
           remoteURL.host != nil {
            webView.load(URLRequest(url: remoteURL))
            return
        }

        if !configuredURL.isEmpty {
            NSLog("Ignoring invalid FrontURL; using the bundled WebView page.")
        }

        let bundleRoot = Bundle.main.bundleURL
        let indexURL = bundleRoot.appendingPathComponent("webviews/index.html")
        webView.loadFileURL(indexURL, allowingReadAccessTo: bundleRoot)
    }

    private func appOwned404URL() -> URL? {
        Bundle.main.url(forResource: "404", withExtension: "html", subdirectory: "webviews")
    }

    private func isAppOwned404(_ url: URL?) -> Bool {
        guard let url, let errorURL = appOwned404URL() else { return false }
        return url.isFileURL && url.path == errorURL.path
    }

    private func showAppOwned404(for failedURL: URL?) {
        guard !showingAppOwned404 else { return }
        guard let errorURL = appOwned404URL() else {
            NSLog("Bundled webviews/404.html is missing.")
            return
        }

        showingAppOwned404 = true
        var pageURL = errorURL
        if let failedURL,
           var components = URLComponents(url: errorURL, resolvingAgainstBaseURL: false) {
            components.queryItems = [URLQueryItem(name: "url", value: failedURL.absoluteString)]
            pageURL = components.url ?? errorURL
        }

        webView.loadFileURL(pageURL, allowingReadAccessTo: Bundle.main.bundleURL)
    }

    func webView(
        _ webView: WKWebView,
        decidePolicyFor navigationAction: WKNavigationAction,
        decisionHandler: @escaping (WKNavigationActionPolicy) -> Void
    ) {
        if navigationAction.targetFrame?.isMainFrame ?? true,
           !isAppOwned404(navigationAction.request.url) {
            showingAppOwned404 = false
        }
        decisionHandler(.allow)
    }

    func webView(
        _ webView: WKWebView,
        decidePolicyFor navigationResponse: WKNavigationResponse,
        decisionHandler: @escaping (WKNavigationResponsePolicy) -> Void
    ) {
        if navigationResponse.isForMainFrame,
           let response = navigationResponse.response as? HTTPURLResponse,
           response.statusCode == 404 {
            decisionHandler(.cancel)
            showAppOwned404(for: response.url)
            return
        }
        decisionHandler(.allow)
    }

    func webView(
        _ webView: WKWebView,
        didFailProvisionalNavigation navigation: WKNavigation?,
        withError error: Error
    ) {
        showAppOwned404(for: webView.url)
    }

    func webView(
        _ webView: WKWebView,
        didFail navigation: WKNavigation?,
        withError error: Error
    ) {
        showAppOwned404(for: webView.url)
    }

    func userContentController(
        _ userContentController: WKUserContentController,
        didReceive message: WKScriptMessage
    ) {
        guard message.name == "frontNative",
              let body = message.body as? [String: Any],
              let command = body["command"] as? String else {
            return
        }

        let payload = body["payload"] as? [String: Any] ?? [:]
        let text = payload["text"] as? String ?? ""

        switch command {
        case "share":
            share(text)
        case "clipboardWrite":
            UIPasteboard.general.string = text
        case "saveState":
            UserDefaults.standard.set(payload["value"] as? String ?? "", forKey: "front-webviews-state")
        default:
            break
        }
    }

    private func share(_ text: String) {
        let controller = UIActivityViewController(
            activityItems: [text],
            applicationActivities: nil
        )
        present(controller, animated: true)
    }
}
