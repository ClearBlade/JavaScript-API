//
//  Certificates.m
//  ClearConcert
//
//  Created by Andy Joslin on 3/15/13.
//
//

#import "Certificates.h"
#import <Cordova/CDVPlugin.h>
#import "NSURLRequest+AllowUntrustedCertificates.h"

@implementation Certificates

- (void)setUntrusted:(CDVInvokedUrlCommand*)command {
    bool isUntrusted = [[command.arguments objectAtIndex:0] boolValue];

    [NSURLRequest setAllowAllRequests:isUntrusted];
    
    CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

@end
