<?php
/**
 * Plugin Name: Adresse Lookup med BBR
 * Plugin URI: https://github.com/cleadsAffiliate/tagprojekt
 * Description: Autocomplete adressesøgning med BBR data (boligareal og tagmateriale) fra DAWA API
 * Version: 1.0.0
 * Author: Jydsk Tagteknik
 * Author URI: https://jydsktagteknik.dk
 * License: GPL v2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: address-lookup-bbr
 * Domain Path: /languages
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Main Plugin Class
 */
class Address_Lookup_BBR {

    /**
     * Plugin version
     */
    const VERSION = '1.0.0';

    /**
     * Constructor
     */
    public function __construct() {
        add_action('wp_enqueue_scripts', array($this, 'enqueue_scripts'));
        add_shortcode('address_lookup', array($this, 'render_shortcode'));
        add_action('init', array($this, 'register_block'));
    }

    /**
     * Enqueue scripts and styles
     */
    public function enqueue_scripts() {
        // Only enqueue if shortcode is present on page
        global $post;
        if (is_a($post, 'WP_Post') && has_shortcode($post->post_content, 'address_lookup')) {
            wp_enqueue_style(
                'address-lookup-bbr-css',
                plugins_url('assets/css/address-lookup.css', __FILE__),
                array(),
                self::VERSION
            );

            wp_enqueue_script(
                'address-lookup-bbr-js',
                plugins_url('assets/js/address-lookup.js', __FILE__),
                array(),
                self::VERSION,
                true
            );

            // Pass settings to JavaScript
            wp_localize_script('address-lookup-bbr-js', 'addressLookupSettings', array(
                'redirectUrl' => get_option('address_lookup_redirect_url', '/beregner/'),
                'autoSubmit' => get_option('address_lookup_auto_submit', 'yes'),
                'autoSubmitDelay' => get_option('address_lookup_auto_submit_delay', '2000'),
                'minChars' => get_option('address_lookup_min_chars', '10')
            ));
        }
    }

    /**
     * Render shortcode
     * Usage: [address_lookup]
     * With custom title: [address_lookup title="Find din adresse"]
     */
    public function render_shortcode($atts) {
        $atts = shortcode_atts(array(
            'title' => 'Søg din adresse',
            'placeholder' => 'Indtast adresse...',
            'button_text' => ''
        ), $atts, 'address_lookup');

        ob_start();
        ?>
        <div class="roof-search">
            <div class="search-container">
                <?php if (!empty($atts['title'])): ?>
                    <h2><?php echo esc_html($atts['title']); ?></h2>
                <?php endif; ?>

                <div class="input-wrapper">
                    <input
                        type="text"
                        id="dawa-autocomplete1"
                        class="address1"
                        placeholder="<?php echo esc_attr($atts['placeholder']); ?>"
                        autocomplete="off"
                    />
                    <button id="search-roof1" class="disabled" aria-label="Søg adresse">
                        <?php if (!empty($atts['button_text'])): ?>
                            <?php echo esc_html($atts['button_text']); ?>
                        <?php else: ?>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        <?php endif; ?>
                    </button>
                </div>

                <ul class="autocomplete1" role="listbox"></ul>

                <div id="bbr-info" class="bbr-info hidden" role="region" aria-live="polite">
                    <h3>BBR Oplysninger</h3>
                    <div class="bbr-data">
                        <div class="bbr-item">
                            <span class="bbr-label">Boligareal:</span>
                            <span id="bbr-boligareal" class="bbr-value">-</span>
                        </div>
                        <div class="bbr-item">
                            <span class="bbr-label">Tagmateriale:</span>
                            <span id="bbr-tagmateriale" class="bbr-value">-</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <?php
        return ob_get_clean();
    }

    /**
     * Register Gutenberg block (optional)
     */
    public function register_block() {
        if (!function_exists('register_block_type')) {
            return;
        }

        // Simple block registration - can be expanded later
        register_block_type('address-lookup-bbr/address-lookup', array(
            'render_callback' => array($this, 'render_shortcode'),
        ));
    }
}

/**
 * Initialize plugin
 */
function address_lookup_bbr_init() {
    return new Address_Lookup_BBR();
}
add_action('plugins_loaded', 'address_lookup_bbr_init');

/**
 * Add settings link on plugin page
 */
function address_lookup_bbr_settings_link($links) {
    $settings_link = '<a href="options-general.php?page=address-lookup-bbr">Indstillinger</a>';
    array_unshift($links, $settings_link);
    return $links;
}
add_filter('plugin_action_links_' . plugin_basename(__FILE__), 'address_lookup_bbr_settings_link');

/**
 * Add admin settings page
 */
function address_lookup_bbr_admin_menu() {
    add_options_page(
        'Adresse Lookup Indstillinger',
        'Adresse Lookup',
        'manage_options',
        'address-lookup-bbr',
        'address_lookup_bbr_settings_page'
    );
}
add_action('admin_menu', 'address_lookup_bbr_admin_menu');

/**
 * Register settings
 */
function address_lookup_bbr_register_settings() {
    register_setting('address_lookup_bbr_settings', 'address_lookup_redirect_url');
    register_setting('address_lookup_bbr_settings', 'address_lookup_auto_submit');
    register_setting('address_lookup_bbr_settings', 'address_lookup_auto_submit_delay');
    register_setting('address_lookup_bbr_settings', 'address_lookup_min_chars');
}
add_action('admin_init', 'address_lookup_bbr_register_settings');

/**
 * Settings page HTML
 */
function address_lookup_bbr_settings_page() {
    if (!current_user_can('manage_options')) {
        return;
    }

    if (isset($_GET['settings-updated'])) {
        add_settings_error('address_lookup_bbr_messages', 'address_lookup_bbr_message', 'Indstillinger gemt', 'updated');
    }

    settings_errors('address_lookup_bbr_messages');
    ?>
    <div class="wrap">
        <h1><?php echo esc_html(get_admin_page_title()); ?></h1>

        <form action="options.php" method="post">
            <?php settings_fields('address_lookup_bbr_settings'); ?>

            <table class="form-table">
                <tr>
                    <th scope="row">
                        <label for="address_lookup_redirect_url">Redirect URL</label>
                    </th>
                    <td>
                        <input type="text"
                               id="address_lookup_redirect_url"
                               name="address_lookup_redirect_url"
                               value="<?php echo esc_attr(get_option('address_lookup_redirect_url', '/beregner/')); ?>"
                               class="regular-text" />
                        <p class="description">URL hvor brugeren sendes hen efter valg af adresse. Brug {address} som placeholder for adressen.</p>
                        <p class="description">Eksempel: <code>/beregner/{address}</code> eller <code>/beregner/</code></p>
                    </td>
                </tr>

                <tr>
                    <th scope="row">
                        <label for="address_lookup_auto_submit">Auto-submit</label>
                    </th>
                    <td>
                        <input type="checkbox"
                               id="address_lookup_auto_submit"
                               name="address_lookup_auto_submit"
                               value="yes"
                               <?php checked(get_option('address_lookup_auto_submit', 'yes'), 'yes'); ?> />
                        <label for="address_lookup_auto_submit">Aktiver automatisk valg af første forslag</label>
                    </td>
                </tr>

                <tr>
                    <th scope="row">
                        <label for="address_lookup_auto_submit_delay">Auto-submit forsinkelse (ms)</label>
                    </th>
                    <td>
                        <input type="number"
                               id="address_lookup_auto_submit_delay"
                               name="address_lookup_auto_submit_delay"
                               value="<?php echo esc_attr(get_option('address_lookup_auto_submit_delay', '2000')); ?>"
                               min="500"
                               max="10000"
                               step="100"
                               class="small-text" /> ms
                        <p class="description">Tid i millisekunder før auto-submit aktiveres (standard: 2000 = 2 sekunder)</p>
                    </td>
                </tr>

                <tr>
                    <th scope="row">
                        <label for="address_lookup_min_chars">Minimum karakterer for auto-submit</label>
                    </th>
                    <td>
                        <input type="number"
                               id="address_lookup_min_chars"
                               name="address_lookup_min_chars"
                               value="<?php echo esc_attr(get_option('address_lookup_min_chars', '10')); ?>"
                               min="1"
                               max="50"
                               class="small-text" />
                        <p class="description">Antal karakterer der skal indtastes før auto-submit starter (standard: 10)</p>
                    </td>
                </tr>
            </table>

            <?php submit_button('Gem indstillinger'); ?>
        </form>

        <hr>

        <h2>Shortcode brug</h2>
        <p>Indsæt følgende shortcode på en side eller i et indlæg:</p>
        <code>[address_lookup]</code>

        <h3>Shortcode parametre</h3>
        <ul>
            <li><code>title</code> - Overskrift (standard: "Søg din adresse")</li>
            <li><code>placeholder</code> - Placeholder tekst (standard: "Indtast adresse...")</li>
            <li><code>button_text</code> - Knap tekst (standard: søgeikon)</li>
        </ul>

        <h3>Eksempler</h3>
        <p><code>[address_lookup title="Find din adresse" placeholder="Skriv adresse her"]</code></p>
        <p><code>[address_lookup button_text="Søg"]</code></p>
    </div>
    <?php
}
