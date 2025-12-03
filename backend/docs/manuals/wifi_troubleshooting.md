# WiFi Connection Troubleshooting Guide

## Common WiFi Connection Issues

### Issue: Cannot Connect to WiFi Network

**Symptoms:**

- WiFi network not appearing in available networks list
- Connection fails with "Cannot connect" error
- Connected but no internet access

**Solutions:**

#### For Windows:

1. Check if WiFi is enabled

   - Click the network icon in system tray
   - Ensure WiFi toggle is ON
   - Or press Windows Key + A, click WiFi tile

2. Restart WiFi adapter

   - Open Settings > Network & Internet > Status
   - Click "Network reset" or "Change adapter options"
   - Right-click WiFi adapter, select "Disable" then "Enable"

3. Forget and reconnect to network

   - Settings > Network & Internet > WiFi
   - Click "Manage known networks"
   - Select network, click "Forget"
   - Reconnect by selecting network and entering password

4. Update WiFi driver

   - Open Device Manager (Win + X, select Device Manager)
   - Expand "Network adapters"
   - Right-click WiFi adapter, select "Update driver"

5. Run Network Troubleshooter
   - Settings > Network & Internet > Status
   - Click "Network troubleshooter"

#### For Mac:

1. Turn WiFi off and on

   - Click WiFi icon in menu bar
   - Click "Turn WiFi Off", wait 5 seconds
   - Click "Turn WiFi On"

2. Forget and rejoin network

   - System Preferences > Network
   - Select WiFi, click "Advanced"
   - Select network, click "-" to remove
   - Reconnect by selecting network

3. Reset network settings
   - Go to System Preferences > Network
   - Select WiFi, click the "-" button
   - Click "Apply", then click "+" to add WiFi back

#### For iPhone/iOS:

1. Toggle Airplane Mode

   - Swipe down from top-right (or up from bottom)
   - Tap Airplane Mode icon, wait 5 seconds
   - Tap again to turn off

2. Forget and reconnect

   - Settings > WiFi
   - Tap (i) icon next to network name
   - Tap "Forget This Network"
   - Reconnect by selecting network

3. Reset Network Settings
   - Settings > General > Transfer or Reset iPhone
   - Tap "Reset" > "Reset Network Settings"
   - Note: This will forget all WiFi passwords

#### For Android:

1. Toggle WiFi

   - Swipe down from top
   - Long-press WiFi icon
   - Turn off, wait 5 seconds, turn on

2. Forget and reconnect

   - Settings > Network & Internet > WiFi
   - Tap network name
   - Tap "Forget"
   - Reconnect by selecting network

3. Reset network settings
   - Settings > System > Reset options
   - Tap "Reset WiFi, mobile & Bluetooth"
   - Confirm reset

### Issue: Weak WiFi Signal

**Solutions:**

1. Move closer to the router
2. Remove physical obstructions
3. Restart the router (unplug for 30 seconds)
4. Check if other devices have same issue
5. Consider WiFi extender or mesh network

### Issue: Connected but No Internet

**Solutions:**

1. Restart router and modem

   - Unplug both devices
   - Wait 30 seconds
   - Plug in modem first, wait 1 minute
   - Plug in router, wait 1 minute

2. Check if other devices can access internet
3. Verify with ISP if there's an outage
4. Try using wired connection to isolate issue

### Advanced Troubleshooting

**Release and Renew IP Address:**

Windows:

```
ipconfig /release
ipconfig /renew
```

Mac/Linux:

```
sudo dhclient -r
sudo dhclient
```

**Flush DNS Cache:**

Windows:

```
ipconfig /flushdns
```

Mac:

```
sudo dscacheutil -flushcache
sudo killall -HUP mDNSResponder
```

**Check DNS Settings:**

- Try using Google DNS (8.8.8.8, 8.8.4.4)
- Or Cloudflare DNS (1.1.1.1, 1.0.0.1)

## Prevention Tips

1. Keep router firmware updated
2. Use strong WiFi password (WPA2 or WPA3)
3. Place router in central location
4. Avoid interference from microwaves and cordless phones
5. Regularly restart router (once a month)
6. Keep device WiFi drivers updated
