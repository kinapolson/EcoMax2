import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useUser } from '../../context/UserContext';
import { ThemedText } from '../../components/themed-text';
import { ThemedView } from '../../components/themed-view';

const RECEIPTS_DATA = [
    {
        id: '1',
        storeName: 'Target',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Target_logo.svg/1200px-Target_logo.svg.png',
        points: 25,
        date: 'November 10, 2025',
        shortDate: '11.10.25',
        total: 25.68,
        items: [
            { code: '331009454', name: 'Wild Fable', price: 6.00, quantity: 1 },
            { code: '331007843', name: 'Wild Fable', price: 6.00, quantity: 1 },
            { code: '331007850', name: 'Wild Fable', price: 12.00, quantity: 2 },
        ],
    },
    {
        id: '2',
        storeName: 'Indeu Apothecary',
        logo: null,
        points: 25,
        date: 'November 10, 2025',
        shortDate: '11.10.25',
        total: 18.50,
        items: [
            { code: '100234', name: 'Herbal Tea', price: 8.50, quantity: 1 },
            { code: '100567', name: 'Essential Oil', price: 10.00, quantity: 1 },
        ],
    },
];

const BASE_URL = "http://localhost:8000";

export default function ProfileScreen() {
    const { user, setUser } = useUser();
    const [showAccountInfo, setShowAccountInfo] = useState(false);
    const router = useRouter();
    const [showHistory, setShowHistory] = useState(false);
    const [selectedReceipt, setSelectedReceipt] = useState<typeof RECEIPTS_DATA[0] | null>(null);
    const [showReceiptImage, setShowReceiptImage] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [showSupport, setShowSupport] = useState(false);
    const [showPrivacy, setShowPrivacy] = useState(false);
    const [pushNotifications, setPushNotifications] = useState(true);
    const [emailNotifications, setEmailNotifications] = useState(false);
    const [displayName, setDisplayName] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [badgeEarned, setBadgeEarned] = useState(0);
    const [badgeTotal, setBadgeTotal] = useState(0);

    useEffect(() => {
        if (!user.userId) return;
        fetch(`${BASE_URL}/get_badges.php?user_id=${user.userId}`)
            .then(res => res.json())
            .then(data => {
                if (data.status === 'success') {
                    setBadgeTotal(data.badges.length);
                    setBadgeEarned(data.badges.filter((b: { earned: number }) => b.earned === 1).length);
                }
            })
            .catch(() => {});
    }, [user.userId]);

    useEffect(() => {
        if (user.userId) {
            setFirstName(user.firstName);
            setLastName(user.lastName);
            setEmail(user.email);
            const full = user.lastName
                ? `${user.firstName} ${user.lastName}`
                : user.firstName;
            setDisplayName(full || 'User');
        }
    }, [user.userId, user.firstName, user.lastName, user.email]);

    const handleSave = async () => {
        if (!firstName.trim() || !email.trim()) {
            Alert.alert("Error", "First name and email are required");
            return;
        }
        try {
            const body: Record<string, string> = {
                user_id: user.userId,
                first_name: firstName.trim(),
                last_name: lastName.trim(),
                email: email.trim(),
            };
            if (password.trim()) {
                body.new_password = password.trim();
            }
            const response = await fetch(`${BASE_URL}/update_profile.php`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });
            const data = await response.json();
            if (data.status === "success") {
                setUser({
                    firstName: firstName.trim(),
                    lastName: lastName.trim(),
                    email: email.trim(),
                });
                const updatedName = lastName.trim()
                    ? `${firstName.trim()} ${lastName.trim()}`
                    : firstName.trim();
                setDisplayName(updatedName);
                setPassword('');
                Alert.alert("Success", "Profile updated successfully");
            } else {
                Alert.alert("Error", data.message || "Update failed");
            }
        } catch {
            Alert.alert("Server Error", "Could not connect to the server");
        }
    };

    if (showAccountInfo) {
        return (
            <View style={styles.accountContainer}>
                {/* Header with back button */}
                <ThemedView style={styles.accountHeader} lightColor="#264e36">
                    <TouchableOpacity
                        style={styles.accountBackButton}
                        onPress={() => setShowAccountInfo(false)}
                    >
                        <Ionicons name="chevron-back-outline" size={28} color="#f5f0e6" />
                    </TouchableOpacity>
                </ThemedView>

                <ScrollView style={styles.accountContent} showsVerticalScrollIndicator={false}>
                    {/* Account Information Card */}
                    <View style={styles.accountCardWrapper}>
                        <View style={styles.accountCard}>
                            <Ionicons name="lock-closed-outline" size={60} color="#f5f0e6" />
                            <ThemedText style={styles.accountCardTitle}>Account Information</ThemedText>
                        </View>
                    </View>

                    {/* Profile Picture */}
                    <View style={styles.accountAvatarWrapper}>
                        <View style={styles.accountAvatarOuter}>
                            <Image
                                source={require('../../assets/pfp/js_pfp.jpg')}
                                style={styles.accountAvatarImage}
                            />
                        </View>
                    </View>

                    {/* Form Fields */}
                    <View style={styles.formContainer}>
                        <View style={styles.inputGroup}>
                            <ThemedText style={styles.inputLabel}>First Name</ThemedText>
                            <TextInput
                                style={styles.textInput}
                                value={firstName}
                                onChangeText={setFirstName}
                                placeholder="First Name"
                                placeholderTextColor="#999"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <ThemedText style={styles.inputLabel}>Last Name</ThemedText>
                            <TextInput
                                style={styles.textInput}
                                value={lastName}
                                onChangeText={setLastName}
                                placeholder="Last Name"
                                placeholderTextColor="#999"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <ThemedText style={styles.inputLabel}>Email</ThemedText>
                            <TextInput
                                style={styles.textInput}
                                value={email}
                                onChangeText={setEmail}
                                placeholder="Email"
                                placeholderTextColor="#999"
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <ThemedText style={styles.inputLabel}>Password</ThemedText>
                            <TextInput
                                style={styles.textInput}
                                value={password}
                                onChangeText={setPassword}
                                placeholder="Leave blank to keep current"
                                placeholderTextColor="#999"
                                secureTextEntry
                            />
                        </View>

                        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                            <ThemedText style={styles.saveButtonText}>Save Changes</ThemedText>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
        );
    }

    if (showReceiptImage && selectedReceipt) {
        return (
            <View style={styles.receiptImageContainer}>
                {/* Header with back button */}
                <View style={styles.receiptImageHeader}>
                    <TouchableOpacity
                        style={styles.receiptImageBackButton}
                        onPress={() => setShowReceiptImage(false)}
                    >
                        <Ionicons name="chevron-back-outline" size={28} color="#f5f0e6" />
                    </TouchableOpacity>
                </View>

                {/* Receipt image - only show for Target */}
                <View style={styles.receiptImageContent}>
                    {selectedReceipt.storeName === 'Target' && (
                        <Image
                            source={require('../../assets/images/target_receipt.jpeg')}
                            style={styles.receiptImage}
                            resizeMode="contain"
                        />
                    )}
                </View>
            </View>
        );
    }

    if (selectedReceipt) {
        return (
            <View style={styles.receiptDetailContainer}>
                {/* Header */}
                <View style={styles.receiptDetailHeader}>
                    <TouchableOpacity
                        style={styles.receiptDetailBackButton}
                        onPress={() => setSelectedReceipt(null)}
                    >
                        <Ionicons name="chevron-back-outline" size={28} color="#f5f0e6" />
                    </TouchableOpacity>

                    <View style={{ flex: 1 }} />

                    <TouchableOpacity
                        style={styles.receiptDetailMenuButton}
                        onPress={() => setShowReceiptImage(true)}
                    >
                        <Ionicons name="reader-outline" size={24} color="#f5f0e6" />
                    </TouchableOpacity>
                </View>

                {/* Receipt card */}
                <View style={styles.receiptDetailContent}>
                    <View style={styles.receiptDetailCard}>
                        {/* Store logo */}
                        <View style={styles.receiptDetailLogoContainer}>
                            <View style={styles.blankLogo} />
                        </View>

                        {/* Store name and date */}
                        <ThemedText style={styles.receiptDetailStoreName}>
                            {selectedReceipt.storeName}
                        </ThemedText>
                        <ThemedText style={styles.receiptDetailDate}>
                            {selectedReceipt.shortDate}
                        </ThemedText>

                        {/* Dashed divider */}
                        <View style={styles.receiptDashedLine} />

                        {/* Line items */}
                        <View style={styles.receiptItemsContainer}>
                            {selectedReceipt.items.map((item, index) => (
                                <View key={index} style={styles.receiptItemRow}>
                                    <ThemedText style={styles.receiptItemText}>
                                        {item.code} {item.name}{item.quantity > 1 ? ` x${item.quantity}` : ''}
                                    </ThemedText>
                                    <ThemedText style={styles.receiptItemPrice}>
                                        ${item.price.toFixed(2)}
                                    </ThemedText>
                                </View>
                            ))}
                        </View>

                        {/* Dashed divider */}
                        <View style={styles.receiptDashedLine} />

                        {/* Spacer */}
                        <View style={{ height: 120 }} />

                        {/* Total divider */}
                        <View style={styles.receiptDashedLine} />

                        {/* Total */}
                        <View style={styles.receiptTotalRow}>
                            <ThemedText style={styles.receiptTotalLabel}>Total</ThemedText>
                            <ThemedText style={styles.receiptTotalValue}>
                                ${selectedReceipt.total.toFixed(2)}
                            </ThemedText>
                        </View>

                        {/* Dashed divider */}
                        <View style={styles.receiptDashedLine} />

                        {/* Points earned */}
                        <View style={styles.receiptPointsEarned}>
                            <Ionicons name="leaf-outline" size={28} color="#264e36" />
                            <ThemedText style={styles.receiptPointsEarnedText}>
                                {selectedReceipt.points}
                            </ThemedText>
                        </View>
                    </View>
                </View>
            </View>
        );
    }

    if (showHistory) {
        return (
            <View style={styles.historyContainer}>
                {/* Header */}
                <ThemedView style={styles.historyHeader} lightColor="#264e36" />


                {/* Content area */}
                <View style={styles.historyContent}>
                    {/* Title row with back button */}
                    <View style={styles.historyTitleRow}>
                        <TouchableOpacity
                            style={styles.historyBackButton}
                            onPress={() => setShowHistory(false)}
                        >
                            <Ionicons name="chevron-back-outline" size={28} color="#264e36" />
                        </TouchableOpacity>

                        <ThemedText style={styles.historyTitle}>My Receipts</ThemedText>

                        <View style={{ width: 28 }} />
                    </View>

                    {/* Receipts list */}
                    <ScrollView
                        style={styles.receiptsListContainer}
                        showsVerticalScrollIndicator={false}
                    >
                        {RECEIPTS_DATA.map((receipt) => (
                            <TouchableOpacity
                                key={receipt.id}
                                style={styles.receiptCardWrapper}
                                onPress={() => setSelectedReceipt(receipt)}
                                activeOpacity={0.7}
                            >
                                {/* Left notch */}
                                <View style={styles.receiptNotchLeft} />

                                <View style={styles.receiptCard}>
                                    <View style={styles.receiptLogoContainer}>
                                        <View style={styles.blankLogo} />
                                    </View>

                                    <View style={styles.receiptDivider} />

                                    <View style={styles.receiptInfo}>
                                        <ThemedText style={styles.receiptStoreName}>{receipt.storeName}</ThemedText>
                                        <View style={styles.receiptPointsRow}>
                                            <Ionicons name="leaf" size={16} color="#264e36" />
                                            <ThemedText style={styles.receiptPoints}>{receipt.points}</ThemedText>
                                        </View>
                                        <ThemedText style={styles.receiptDate}>{receipt.date}</ThemedText>
                                    </View>
                                </View>

                                {/* Right notch */}
                                <View style={styles.receiptNotchRight} />
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            </View>
        );
    }

    if (showNotifications) {
        return (
            <View style={styles.notificationsContainer}>
                {/* Header */}
                <ThemedView style={styles.notificationsHeader} lightColor="#264e36">
                    <TouchableOpacity
                        style={styles.notificationsBackButton}
                        onPress={() => setShowNotifications(false)}
                    >
                        <Ionicons name="chevron-back-outline" size={28} color="#f5f0e6" />
                    </TouchableOpacity>
                </ThemedView>

                {/* Content area */}
                <View style={styles.notificationsContent}>
                    {/* Notifications card with bell */}
                    <View style={styles.notificationsCardWrapper}>
                        <View style={styles.notificationsCard}>
                            <Ionicons name="notifications-outline" size={32} color="#f5f0e6" style={styles.notificationsBellEmoji} />
                            <ThemedText style={styles.notificationsCardTitle}>Notifications</ThemedText>
                        </View>
                    </View>

                    {/* Toggle options */}
                    <View style={styles.notificationsToggleWrapper}>
                        <View style={styles.notificationsToggleRow}>
                            <ThemedText style={styles.notificationsToggleLabel}>Push Notifications</ThemedText>
                            <Switch
                                value={pushNotifications}
                                onValueChange={setPushNotifications}
                                trackColor={{ false: '#ccc', true: '#5ca377' }}
                                thumbColor="#fff"
                            />
                        </View>

                        <View style={styles.notificationsToggleRow}>
                            <ThemedText style={styles.notificationsToggleLabel}>Email Notifications</ThemedText>
                            <Switch
                                value={emailNotifications}
                                onValueChange={setEmailNotifications}
                                trackColor={{ false: '#ccc', true: '#5ca377' }}
                                thumbColor="#fff"
                            />
                        </View>
                    </View>
                </View>
            </View>
        );
    }

    if (showSupport) {
        return (
            <View style={styles.supportContainer}>
                {/* Header */}
                <ThemedView style={styles.supportHeader} lightColor="#264e36">
                    <TouchableOpacity
                        style={styles.supportBackButton}
                        onPress={() => setShowSupport(false)}
                    >
                        <Ionicons name="chevron-back-outline" size={28} color="#f5f0e6" />
                    </TouchableOpacity>
                </ThemedView>

                {/* Content area */}
                <ScrollView style={styles.supportContent} showsVerticalScrollIndicator={false}>
                    {/* Support card with phone */}
                    <View style={styles.supportCardWrapper}>
                        <View style={styles.supportCard}>
                            <Ionicons name="call-outline" size={32} color="#f5f0e6" style={styles.supportPhoneEmoji} />
                            <ThemedText style={styles.supportCardTitle}>Support</ThemedText>
                        </View>
                    </View>

                    {/* Welcome text */}
                    <ThemedText style={styles.supportWelcomeText}>Welcome to EcoMax Support!</ThemedText>

                    {/* Action buttons */}
                    <View style={styles.supportButtonsWrapper}>
                        <TouchableOpacity style={styles.supportButton}>
                            <ThemedText style={styles.supportButtonText}>How it Works</ThemedText>
                            <Ionicons name="chevron-forward" size={24} color="#f5f0e6" />
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.supportButton}>
                            <ThemedText style={styles.supportButtonText}>Report a Bug</ThemedText>
                            <Ionicons name="chevron-forward" size={24} color="#f5f0e6" />
                        </TouchableOpacity>
                    </View>

                    {/* FAQs section */}
                    <ThemedText style={styles.supportFaqTitle}>FAQs</ThemedText>

                    <View style={styles.supportButtonsWrapper}>
                        <TouchableOpacity style={styles.supportButton}>
                            <ThemedText style={styles.supportButtonText}>How do I scan a receipt?</ThemedText>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.supportButton}>
                            <ThemedText style={styles.supportButtonText}>Why didn't my points show?</ThemedText>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.supportButton}>
                            <ThemedText style={styles.supportButtonText}>How do I redeem rewards?</ThemedText>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
        );
    }

    if (showPrivacy) {
        return (
            <View style={styles.privacyContainer}>
                {/* Header */}
                <ThemedView style={styles.privacyHeader} lightColor="#264e36">
                    <TouchableOpacity
                        style={styles.privacyBackButton}
                        onPress={() => setShowPrivacy(false)}
                    >
                        <Ionicons name="chevron-back-outline" size={28} color="#f5f0e6" />
                    </TouchableOpacity>
                </ThemedView>

                {/* Content area */}
                <ScrollView style={styles.privacyContent} showsVerticalScrollIndicator={false}>
                    {/* Privacy card with shield */}
                    <View style={styles.privacyCardWrapper}>
                        <View style={styles.privacyCard}>
                            <Ionicons name="shield-checkmark-outline" size={32} color="#f5f0e6" style={styles.privacyShieldEmoji} />
                            <ThemedText style={styles.privacyCardTitle}>Privacy</ThemedText>
                        </View>
                    </View>

                    {/* Privacy info cards */}
                    <View style={styles.privacyInfoWrapper}>
                        <View style={styles.privacyInfoCard}>
                            <ThemedText style={styles.privacyInfoText}>
                                At EcoMax, we prioritize your privacy. We collect data necessary to enhance your experience such as expiration dates and user preferences.
                            </ThemedText>
                        </View>

                        <View style={styles.privacyInfoCard}>
                            <ThemedText style={styles.privacyInfoText}>
                                Your information is never shared with third parties, and is securely stored.
                            </ThemedText>
                        </View>

                        <View style={styles.privacyInfoCard}>
                            <ThemedText style={styles.privacyInfoText}>
                                You can manage or delete your data at any time through the app settings.
                            </ThemedText>
                        </View>
                    </View>
                </ScrollView>
            </View>
        );
    }

    if (showSettings) {
        return (
            <View style={styles.settingsContainer}>
                {/* Header */}
                <ThemedView style={styles.settingsHeader} lightColor="#264e36" />

                {/* Content area */}
                <View style={styles.settingsContent}>
                    {/* Title row with back button */}
                    <View style={styles.settingsTitleRow}>
                        <TouchableOpacity
                            style={styles.settingsBackButton}
                            onPress={() => setShowSettings(false)}
                        >
                            <Ionicons name="chevron-back-outline" size={28} color="#264e36" />
                        </TouchableOpacity>

                        <ThemedText style={styles.settingsTitle}>Settings</ThemedText>

                        <View style={{ width: 28 }} />
                    </View>

                    {/* Settings menu items */}
                    <View style={styles.settingsMenuWrapper}>
                        <TouchableOpacity
                            style={styles.settingsMenuItem}
                            onPress={() => {
                                setShowSettings(false);
                                setShowAccountInfo(true);
                            }}
                        >
                            <Ionicons name="lock-closed-outline" size={24} color="#f5f0e6" />
                            <ThemedText style={styles.settingsMenuText}>Account Information</ThemedText>
                            <Ionicons name="chevron-forward" size={24} color="#f5f0e6" />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.settingsMenuItem}
                            onPress={() => {
                                setShowSettings(false);
                                setShowNotifications(true);
                            }}
                        >
                            <Ionicons name="notifications-outline" size={24} color="#f5f0e6" />
                            <ThemedText style={styles.settingsMenuText}>Notifications</ThemedText>
                            <Ionicons name="chevron-forward" size={24} color="#f5f0e6" />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.settingsMenuItem}
                            onPress={() => {
                                setShowSettings(false);
                                setShowSupport(true);
                            }}
                        >
                            <Ionicons name="call-outline" size={24} color="#f5f0e6" />
                            <ThemedText style={styles.settingsMenuText}>Support</ThemedText>
                            <Ionicons name="chevron-forward" size={24} color="#f5f0e6" />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.settingsMenuItem}
                            onPress={() => {
                                setShowSettings(false);
                                setShowPrivacy(true);
                            }}
                        >
                            <Ionicons name="shield-checkmark-outline" size={24} color="#f5f0e6" />
                            <ThemedText style={styles.settingsMenuText}>Privacy</ThemedText>
                            <Ionicons name="chevron-forward" size={24} color="#f5f0e6" />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.settingsMenuItem, { marginTop: 20, backgroundColor: '#C0392B' }]}
                            onPress={() => router.replace('/(auth)')}
                        >
                            <Ionicons name="log-out-outline" size={24} color="#f5f0e6" />
                            <ThemedText style={styles.settingsMenuText}>Sign Out</ThemedText>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }

    return (
    <ScrollView style={styles.container}>
        {/* header */}
        <View style={styles.header}>
        <Image
            source={require('../../assets/images/ecomax_icon_dark.png')}
            style={styles.image}
        />

        <TouchableOpacity onPress={() => setShowSettings(true)}>
            <Ionicons name="settings-outline" size={26} color="#F5F0E6" />
        </TouchableOpacity>
        </View>

        {/* profile card */}
        <View style={styles.cardWrapper}>
        <View style={styles.profileCard}>
            <Image
            source={require('../../assets/pfp/js_pfp.jpg')}
            style={styles.avatar}
            />

            <Text style={styles.name}>{displayName}</Text>

            <View style={styles.statsRow}>
            <View style={styles.statItem}>
                <Text style={styles.statLabel}>Eco Points</Text>
                <Text style={styles.statValue}>{user.ecoPoints ?? "—"}</Text>
            </View>

            <View style={styles.divider} />

            <TouchableOpacity
                style={styles.statItem}
                onPress={() => router.push({ pathname: '/badges', params: { userId: user.userId } })}
            >
                <View style={styles.badgeLabelRow}>
                    <Text style={styles.statLabel}>Eco Badges</Text>
                    <Ionicons name="chevron-forward-outline" size={13} color="#F5F0E6" />
                </View>
                <Text style={styles.statValue}>{badgeEarned}/{badgeTotal}</Text>
            </TouchableOpacity>
            </View>
        </View>
        </View>

        {/* options */}
        <View style={styles.optionsContainer}>
        {/* acct info */}
        <TouchableOpacity
            style={styles.optionCard}
            onPress={() => setShowAccountInfo(true)}
        >
            <View style={styles.optionLeft}>
            <Ionicons name="lock-closed-outline" size={20} color="#F5F0E6" />
            <Text style={styles.optionText}>Account Information</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#F5F0E6" />
        </TouchableOpacity>

        {/* history */}
        <TouchableOpacity
            style={styles.optionCard}
            onPress={() => setShowHistory(true)}
        >
            <View style={styles.optionLeft}>
            <Ionicons name="receipt-outline" size={20} color="#F5F0E6" />
            <Text style={styles.optionText}>History</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#F5F0E6" />
        </TouchableOpacity>
        </View>
    </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F5F0E6",
    },

    /* header */
    header: {
        backgroundColor: "#264e36",
        paddingTop: 80,
        paddingBottom: 100,
        paddingHorizontal: 20,
        flexDirection: "row",
        justifyContent: "space-between",
    },

    image: {
        height: 49,
        width: 37,
    },

    /* overlap wrapper */
    cardWrapper: {
        alignItems: "center",
        marginTop: -70, 
    },

    /* profile card */
    profileCard: {
        backgroundColor: "#5ca377",
        width: "85%",
        borderRadius: 20,
        paddingTop: 60, 
        paddingBottom: 20,
        alignItems: "center",
    },

    /* user pfp pic */
    avatar: {
        width: 90,
        height: 90,
        borderRadius: 45,
        position: "absolute",
        top: -45, 
    },

    name: {
        fontSize: 24,
        fontFamily: "Quicksand_700Bold",
        color: "#F5F0E6",
        marginBottom: 10,
    },

    statsRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 10,
    },

    statItem: {
        alignItems: "center",
        paddingHorizontal: 25,
    },

    statLabel: {
        fontSize: 13,
        color: "#F5F0E6",
        fontFamily: "Quicksand_400Regular",
    },

    badgeLabelRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 3,
    },

    statValue: {
        fontSize: 26,
        fontFamily: "Quicksand_700Bold",
        color: "#F5F0E6",
    },

    divider: {
        width: 1.5,
        height: 40,
        backgroundColor: "#F5F0E6",
    },

    /* optoins */
    optionsContainer: {
        marginTop: 30,
        alignItems: "center",
    },

    optionCard: {
        backgroundColor: "#A47148",
        width: "85%",
        borderRadius: 16,
        padding: 18,
        marginBottom: 16,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    optionLeft: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },

    optionText: {
        color: "#F5F0E6",
        fontSize: 16,
        fontFamily: "Quicksand_700Bold",
    },

    // Account Information view styles
    accountContainer: {
        flex: 1,
        backgroundColor: '#f5f0e6',
    },

    accountHeader: {
        backgroundColor: '#264e36',
        paddingTop: 50,
        paddingBottom: 30,
        paddingLeft: 16,
    },

    accountBackButton: {
        padding: 4,
        width: 40,
    },

    accountContent: {
        flex: 1,
        backgroundColor: '#f5f0e6',
    },

    accountCardWrapper: {
        alignItems: 'center',
        marginTop: -10,
        paddingHorizontal: 24,
    },

    accountCard: {
        backgroundColor: '#5ca377',
        borderRadius: 20,
        paddingVertical: 24,
        paddingHorizontal: 40,
        alignItems: 'center',
        width: '100%',
    },

    accountCardTitle: {
        color: '#f5f0e6',
        fontSize: 22,
        fontFamily: 'Quicksand_700Bold',
        marginTop: 12,
    },

    accountAvatarWrapper: {
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 20,
    },

    accountAvatarOuter: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#fff',
        overflow: 'hidden',
        borderWidth: 3,
        borderColor: '#264e36',
    },

    accountAvatarImage: {
        width: '100%',
        height: '100%',
    },

    formContainer: {
        paddingHorizontal: 24,
        paddingBottom: 40,
    },

    inputGroup: {
        marginBottom: 16,
    },

    inputLabel: {
        color: '#161618',
        fontSize: 14,
        fontFamily: 'Poppins_400Regular',
        marginBottom: 4,
        marginLeft: 12,
    },

    textInput: {
        backgroundColor: '#fff',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#161618',
        paddingVertical: 14,
        paddingHorizontal: 16,
        fontSize: 17,
        color: '#161618',
        fontFamily: 'Quicksand_700Bold',
    },

    saveButton: {
        backgroundColor: '#a8c5a8',
        borderRadius: 20,
        paddingVertical: 16,
        alignItems: 'center',
        marginTop: 16,
    },

    saveButtonText: {
        color: '#264e36',
        fontSize: 18,
        fontFamily: 'Quicksand_700Bold',
    },

    // History/My Receipts view styles
    historyContainer: {
        flex: 1,
        backgroundColor: '#f5f0e6',
    },

    historyHeader: {
        backgroundColor: '#264e36',
        paddingTop: 50,
        paddingBottom: 20,
        paddingLeft: 16,
    },

    historyContent: {
        flex: 1,
        backgroundColor: '#f5f0e6',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        marginTop: -20,
        paddingTop: 20,
    },

    historyTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        marginBottom: 24,
    },

    historyBackButton: {
        padding: 4,
    },

    historyTitle: {
        fontSize: 32,
        lineHeight: 42,
        fontFamily: 'Quicksand_700Bold',
        color: '#264e36',
        flex: 1,
        textAlign: 'center',
    },

    receiptsListContainer: {
        flex: 1,
        paddingHorizontal: 24,
    },

    receiptCardWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        position: 'relative',
    },

    receiptNotchLeft: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#f5f0e6',
        position: 'absolute',
        left: -10,
        zIndex: 1,
    },

    receiptNotchRight: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#f5f0e6',
        position: 'absolute',
        right: -10,
        zIndex: 1,
    },

    receiptCard: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 16,
        paddingVertical: 16,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },

    receiptLogoContainer: {
        width: 60,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
    },

    targetLogo: {
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },

    targetOuterRing: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#e31837',
        position: 'absolute',
    },

    targetInnerRing: {
        width: 34,
        height: 34,
        borderRadius: 17,
        backgroundColor: '#fff',
        position: 'absolute',
    },

    targetCenter: {
        width: 18,
        height: 18,
        borderRadius: 9,
        backgroundColor: '#e31837',
        position: 'absolute',
    },

    indeuLogo: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#5c5c3d',
        justifyContent: 'center',
        alignItems: 'center',
    },

    blankLogo: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#fff',
    },

    receiptDivider: {
        width: 2,
        height: 50,
        backgroundColor: '#e0e0e0',
        marginHorizontal: 16,
        borderStyle: 'dashed',
    },

    receiptInfo: {
        flex: 1,
    },

    receiptStoreName: {
        fontSize: 20,
        fontFamily: 'Quicksand_700Bold',
        color: '#161618',
        marginBottom: 4,
    },

    receiptPointsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 2,
    },

    receiptPoints: {
        fontSize: 14,
        fontFamily: 'Quicksand_700Bold',
        color: '#161618',
        marginLeft: 4,
    },

    receiptDate: {
        fontSize: 12,
        color: '#161618',
        fontFamily: 'Poppins_400Regular',
    },

    // Receipt Detail view styles
    receiptDetailContainer: {
        flex: 1,
        backgroundColor: '#264e36',
    },

    receiptDetailHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 50,
        paddingBottom: 16,
        paddingHorizontal: 16,
    },

    receiptDetailBackButton: {
        padding: 4,
    },

    receiptDetailMenuButton: {
        padding: 4,
    },

    receiptDetailContent: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: 40,
        paddingTop: 40,
    },

    receiptDetailCard: {
        backgroundColor: '#f5f0e6',
        borderRadius: 8,
        paddingVertical: 24,
        paddingHorizontal: 24,
        width: '100%',
        alignItems: 'center',
    },

    receiptDetailLogoContainer: {
        marginBottom: 12,
    },

    receiptDetailTargetLogo: {
        width: 60,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
    },

    receiptDetailStoreName: {
        fontSize: 20,
        fontWeight: '700',
        color: '#161618',
        marginBottom: 4,
    },

    receiptDetailDate: {
        fontSize: 14,
        color: '#161618',
        marginBottom: 16,
        fontFamily: 'Poppins_400Regular',
    },

    receiptDashedLine: {
        width: '100%',
        borderBottomWidth: 1,
        borderBottomColor: '#161618',
        borderStyle: 'dashed',
        marginVertical: 8,
    },

    receiptItemsContainer: {
        width: '100%',
        paddingVertical: 8,
    },

    receiptItemRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 6,
    },

    receiptItemText: {
        fontSize: 14,
        color: '#161618',
        fontFamily: 'Poppins_400Regular',
        flex: 1,
    },

    receiptItemPrice: {
        fontSize: 14,
        color: '#161618',
        fontFamily: 'Poppins_400Regular',
        marginLeft: 16,
    },

    receiptTotalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        paddingVertical: 4,
    },

    receiptTotalLabel: {
        fontSize: 16,
        fontFamily: 'Poppins_700Bold',
        color: '#161618',
    },

    receiptTotalValue: {
        fontSize: 16,
        fontFamily: 'Poppins_400Regular',
        color: '#161618',
    },

    receiptPointsEarned: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 8,
    },

    receiptPointsEarnedText: {
        fontSize: 36,
        lineHeight: 40,
        fontFamily: 'Quicksand_700Bold',
        color: '#161618',
        marginLeft: 8,
    },

    // Receipt Image view styles
    receiptImageContainer: {
        flex: 1,
        backgroundColor: '#264e36',
    },

    receiptImageHeader: {
        paddingTop: 50,
        paddingBottom: 16,
        paddingHorizontal: 16,
    },

    receiptImageBackButton: {
        padding: 4,
        width: 40,
    },

    receiptImageContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingBottom: 40,
    },

    receiptImage: {
        width: '100%',
        height: '100%',
        maxHeight: '90%',
    },

    // Header content for gear icon
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingRight: 20,
    },

    // Settings view styles
    settingsContainer: {
        flex: 1,
        backgroundColor: '#f5f0e6',
    },

    settingsHeader: {
        backgroundColor: '#264e36',
        paddingTop: 50,
        paddingBottom: 40,
    },

    settingsContent: {
        flex: 1,
        backgroundColor: '#f5f0e6',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        marginTop: -20,
        paddingTop: 20,
    },

    settingsTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        marginBottom: 24,
    },

    settingsBackButton: {
        padding: 4,
    },

    settingsTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#264e36',
        flex: 1,
        textAlign: 'center',
    },

    settingsMenuWrapper: {
        paddingHorizontal: 24,
    },

    settingsMenuItem: {
        backgroundColor: '#a47148',
        borderRadius: 12,
        paddingVertical: 16,
        paddingHorizontal: 16,
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
    },

    settingsMenuText: {
        color: '#f5f0e6',
        fontSize: 22,
        fontFamily: 'Quicksand_700Bold',
        flex: 1,
        marginLeft: 12,
    },

    // Notifications view styles
    notificationsContainer: {
        flex: 1,
        backgroundColor: '#f5f0e6',
    },

    notificationsHeader: {
        backgroundColor: '#264e36',
        paddingTop: 50,
        paddingBottom: 30,
        paddingLeft: 16,
    },

    notificationsBackButton: {
        padding: 4,
        width: 40,
    },

    notificationsContent: {
        flex: 1,
        backgroundColor: '#f5f0e6',
    },

    notificationsCardWrapper: {
        alignItems: 'center',
        marginTop: 20,
        paddingHorizontal: 24,
    },

    notificationsCard: {
        backgroundColor: '#5ca377',
        borderRadius: 20,
        paddingVertical: 24,
        paddingHorizontal: 40,
        alignItems: 'center',
        width: '100%',
    },

    notificationsBellEmoji: {
        fontSize: 60,
        marginTop: 20,
    },

    notificationsCardTitle: {
        color: '#f5f0e6',
        fontSize: 22,
        fontFamily: 'Quicksand_700Bold',
        marginTop: 12,
    },

    notificationsToggleWrapper: {
        paddingHorizontal: 24,
        marginTop: 30,
    },

    notificationsToggleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
    },

    notificationsToggleLabel: {
        color: '#264e36',
        fontSize: 22,
        fontFamily: 'Quicksand_700Bold',
    },

    // Support view styles
    supportContainer: {
        flex: 1,
        backgroundColor: '#f5f0e6',
    },

    supportHeader: {
        backgroundColor: '#264e36',
        paddingTop: 50,
        paddingBottom: 30,
        paddingLeft: 16,
    },

    supportBackButton: {
        padding: 4,
        width: 40,
    },

    supportContent: {
        flex: 1,
        backgroundColor: '#f5f0e6',
    },

    supportCardWrapper: {
        alignItems: 'center',
        marginTop: 70,
        paddingHorizontal: 24,
    },

    supportCard: {
        backgroundColor: '#5ca377',
        borderRadius: 20,
        paddingVertical: 24,
        paddingHorizontal: 40,
        alignItems: 'center',
        width: '100%',
    },

    supportPhoneEmoji: {
        fontSize: 60,
        marginTop: 20,
    },

    supportCardTitle: {
        color: '#f5f0e6',
        fontSize: 22,
        fontFamily: 'Quicksand_700Bold',
        marginTop: 12,
    },

    supportWelcomeText: {
        color: '#264e36',
        fontSize: 22,
        fontFamily: 'Quicksand_700Bold',
        textAlign: 'center',
        marginTop: 24,
        marginBottom: 16,
        paddingHorizontal: 24,
    },

    supportButtonsWrapper: {
        paddingHorizontal: 24,
    },

    supportButton: {
        backgroundColor: '#a47148',
        borderRadius: 12,
        paddingVertical: 16,
        paddingHorizontal: 16,
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },

    supportButtonText: {
        color: '#f5f0e6',
        fontSize: 22,
        fontFamily: 'Quicksand_700Bold',
        flex: 1,
    },

    supportFaqTitle: {
        color: '#264e36',
        fontSize: 22,
        fontFamily: 'Quicksand_700Bold',
        textAlign: 'center',
        marginTop: 16,
        marginBottom: 16,
    },

    // Privacy view styles
    privacyContainer: {
        flex: 1,
        backgroundColor: '#f5f0e6',
    },

    privacyHeader: {
        backgroundColor: '#264e36',
        paddingTop: 50,
        paddingBottom: 30,
        paddingLeft: 16,
    },

    privacyBackButton: {
        padding: 4,
        width: 40,
    },

    privacyContent: {
        flex: 1,
        backgroundColor: '#f5f0e6',
    },

    privacyCardWrapper: {
        alignItems: 'center',
        marginTop: 70,
        paddingHorizontal: 24,
    },

    privacyCard: {
        backgroundColor: '#5ca377',
        borderRadius: 20,
        paddingVertical: 24,
        paddingHorizontal: 40,
        alignItems: 'center',
        width: '100%',
    },

    privacyShieldEmoji: {
        fontSize: 60,
        marginTop: 20,
    },

    privacyCardTitle: {
        color: '#f5f0e6',
        fontSize: 22,
        fontFamily: 'Quicksand_700Bold',
        marginTop: 12,
    },

    privacyInfoWrapper: {
        paddingHorizontal: 24,
        marginTop: 24,
    },

    privacyInfoCard: {
        backgroundColor: '#a47148',
        borderRadius: 16,
        paddingVertical: 20,
        paddingHorizontal: 20,
        marginBottom: 16,
    },

    privacyInfoText: {
        color: '#f5f0e6',
        fontSize: 22,
        fontFamily: 'Poppins_400Regular',
        lineHeight: 26,
    },
});